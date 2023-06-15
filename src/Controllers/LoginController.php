<?php

namespace Tm\Chat\Controllers;

use Delight\Auth\Auth;
use League\Plates\Engine;
use Delight\Db\PdoDatabase;

use Tm\Chat\Core\Token;
use Tm\Chat\Core\Input;
use Tm\Chat\Core\Redirect;
use Tm\Chat\Core\Session;


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class LoginController {

    private $auth, $templates, $session_name, $input, $token, $mail, $db;

    function __construct(Engine $templates, PHPMailer $mail, PdoDatabase $db, Auth $auth) {
        $this->templates = $templates;
        $this->mail = $mail;
        $this->db = $db;
        $this->auth = $auth;
    }

    public function login_form_view(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            echo $this->templates->render('login');
        } else {
            Redirect::to('/');
        }
    }

    public function reg_form_view(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            echo $this->templates->render('register');
        } else {
            Redirect::to('/');
        }
    }

    public function logout(): void {
        $this->auth->logOut();
        $this->auth->destroySession();
        Redirect::to('/login');
    }

    public function login(): void
    {
        if (!$this->auth->isLoggedIn()) {
            try {
                if(Input::exists()) {
                    if(Token::check(Input::get('token'))) {
                        $this->auth->login($_POST['email'], $_POST['password']);
                        //User is logged in
                        Redirect::to('/');
                    }
                } else {
                    echo $this->templates->render('login', [
                        'message' => 'Token error',
                        'type' => 'error'
                    ]);
                }
            }
            catch (\Delight\Auth\InvalidEmailException $e) {
                echo $this->templates->render('login', [
                    'message' => 'Wrong email address',
                    'type' => 'error'
                ]);
            }
            catch (\Delight\Auth\InvalidPasswordException $e) {
                echo $this->templates->render('login', [
                    'message' => 'Wrong password',
                    'type' => 'error'
                ]);
            }
            catch (\Delight\Auth\EmailNotVerifiedException $e) {
               self::retryConfirm($_POST['email']);
               echo $this->templates->render('login', [
                'message' => 'Email не подтвержден, проверьте почту.',
                'type' => 'error'
            ]);
              
            }
            catch (\Delight\Auth\TooManyRequestsException $e) {
                echo $this->templates->render('login', [
                    'message' => 'Too many requests',
                    'type' => 'error'
                ]);
            }
        }
    }

    public function isRetryConfirm(): void {
        try {
            $this->auth->resendConfirmationForEmail('oleg.kayrullin@gmail.com', function ($selector, $token) {
                //$this->mail->SMTPDebug = 2; // Режим отладки - подробный лог событий
                $this->mail->CharSet = 'utf-8';
                $this->mail->isSMTP();                                      
                $this->mail->Host = 'smtp.gmail.com'; //проще всего делать через gmail. В "Управление аккаунтом Google" выбираем "Безопасность". Почти в самом низу будет "Ненадежные приложения, у которых и т.д." - это мы должны включить!
                $this->mail->SMTPAuth = true;
                $this->mail->Username = 'oleg.khayrullin@gmail.com'; //реальная gmail почта
                $this->mail->Password = 'uifowdksgpknkkiy'; //реальный пароль от этой почты
                $this->mail->SMTPSecure = 'tls';
                $this->mail->Port = 587;
                $this->mail->setFrom('oleg.khayrullin@gmail.com'); //повторяем ту же gmail почту 
                $this->mail->addAddress($_POST['email']); //куда хотим получать письма (уже не обязательно от гугла)
                $this->mail->isHTML(true); //включаем html разметку в письме  
                $this->mail->Subject = 'Подтверждение регистрации в чате';
                $this->mail->Body    = 'Для подтверждения регистрации нажмите ссылку http://localhost/verify_email?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);    
                if ($this->mail->send()) {
                    Redirect::to('/login');
                    echo $this->templates->render('login', [
                        'message' => 'На указанную почту отправлено сообщение для подтверждения регистрации.',
                        'type' => 'success'
                    ]);
                } else {
                    echo $this->templates->render('login', [
                        'message' => 'Письмо не отправлено. Ошибка Mailer-а.',
                        'type' => 'error'
                   ]);
                }
            });
        }
         catch (\Delight\Auth\ConfirmationRequestNotFound $e) {
             echo $this->templates->render('login', [
                 'message' => 'No earlier request found that could be re-sent',
                 'type' => 'error'
             ]);
         }
         catch (\Delight\Auth\TooManyRequestsException $e) {
             echo $this->templates->render('login', [
                 'message' => 'There have been too many requests -- try again later',
                 'type' => 'error'
             ]);
         }
    }

    public function isConfirmRegistration() {
        try {
            $this->auth->confirmEmail($_GET['selector'], $_GET['token']);
                Redirect::to('/login');
                echo $this->templates->render('login', [
                    'message' => 'Регистрация подтверждена.',
                    'type' => 'success'
                ]);
        }
        catch (\Delight\Auth\InvalidSelectorTokenPairException $e) {
            echo $this->templates->render('login', [
                'message' => 'Неправильный токен.',
                'type' => 'error'
            ]);
        }
        catch (\Delight\Auth\TokenExpiredException $e) {
            echo $this->templates->render('login', [
                'message' => 'Токен устарел.',
                'type' => 'error'
            ]);
        }
        catch (\Delight\Auth\UserAlreadyExistsException $e) {
            echo $this->templates->render('login', [
                'message' => 'Email уже используется.',
                'type' => 'error'
            ]);
        }
        catch (\Delight\Auth\TooManyRequestsException $e) {
            echo $this->templates->render('login', [
                'message' => 'Слишком много запросов.',
                'type' => 'error'
            ]);
        }
    }
  
    public function isRegistration(): void 
    {
            try {
                    $username = (($_POST['username'] == '') ? 'User' . mb_substr(uniqid(), 4, 4) : $_POST['username']);
                    $userId = $this->auth->registerWithUniqueUsername($_POST['email'], $_POST['password'], $username, function ($selector, $token) {
                        $newIdUser = $this->db->getLastInsertId();
                    //$this->mail->SMTPDebug = 2;
                    $this->mail->CharSet = 'utf-8';
                    $this->mail->isSMTP();                                      
                    $this->mail->Host = 'smtp.gmail.com'; //проще всего делать через gmail. В "Управление аккаунтом Google" выбираем "Безопасность". Почти в самом низу будет "Ненадежные приложения, у которых и т.д." - это мы должны включить!
                    $this->mail->SMTPAuth = true;
                    $this->mail->Username = 'oleg.khayrullin@gmail.com'; //реальная gmail почта
                    $this->mail->Password = 'uifowdksgpknkkiy'; // спец пароль приложения
                    $this->mail->SMTPSecure = 'tls';
                    $this->mail->Port = 587;
                    $this->mail->setFrom('oleg.khayrullin@gmail.com'); //повторяем ту же gmail почту 
                    $this->mail->addAddress($_POST['email']); //куда хотим получать письма (уже не обязательно от гугла)
                    $this->mail->isHTML(true); //включаем html разметку в письме  
                    $this->mail->Subject = 'Подтверждение регистрации в чате';
                    $this->mail->Body    = 'Для подтверждения регистрации нажмите ссылку http://localhost/verify_email?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);
                                       
                        if ($this->mail->send()) {
                            // Добавить чат в контакты пользователей
                            // $column = $this->db->selectColumn(
                            //     'SELECT DISTINCT chat_id FROM chat_list'
                            // );
                            // foreach($column as $item) {
                            //     $this->db->insert(
                            //         'chat_list',
                            //         [
                            //             // set
                            //             'owner_id' => $newIdUser,
                            //             'chat_id' => $item,
                            //             'alarm' => 1,
                            //             'lasttime' => '',
                            //             'group_status' => 0
                            //         ]
                            //     );
                            //     if ($item < 10000) {
                            //         $this->db->insert(
                            //             'chat_list',
                            //             [
                            //                 // set
                            //                 'owner_id' => $item,
                            //                 'chat_id' => $newIdUser,
                            //                 'alarm' => 1,
                            //                 'lasttime' => '',
                            //                 'group_status' => 0
                            //             ]
                            //         );
                            //     }
                            // }
                            Redirect::to('/login');
                            echo $this->templates->render('login', [
                                'message' => 'На указанную почту отправлено сообщение для подтверждения регистрации.',
                                'type' => 'success'
                            ]);
                        } else {
                            echo $this->templates->render('login', [
                                'message' => 'Письмо не отправлено. Ошибка Mailer-а.',
                                'type' => 'error'
                           ]);
                        }
                    });
            }
            catch (\Delight\Auth\DuplicateUsernameException $e) {
                echo $this->templates->render('register', [
                    'message' => 'Данное имя пользователя уже используется.',
                    'type' => 'error'
                ]);
            }
            catch (\Delight\Auth\InvalidEmailException $e) {
                echo $this->templates->render('register', [
                    'message' => 'Invalid email address',
                    'type' => 'error'
                ]);
            }
            catch (\Delight\Auth\InvalidPasswordException $e) {
                echo $this->templates->render('register', [
                    'message' => 'Invalid password',
                    'type' => 'error'
                ]);
            }
            catch (\Delight\Auth\UserAlreadyExistsException $e) {
                echo $this->templates->render('register', [
                    'message' => 'User already exists',
                    'type' => 'error'
                ]);
            }
            catch (\Delight\Auth\TooManyRequestsException $e) {
                echo $this->templates->render('register', [
                    'message' => 'Too many requests',
                    'type' => 'error'
                ]);
            }
    }

}