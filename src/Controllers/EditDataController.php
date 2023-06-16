<?php

namespace Tm\Chat\Controllers;

use Delight\Auth\Auth;
use League\Plates\Engine;
use Delight\Db\PdoDatabase;

use Tm\Chat\Core\Token;
use Tm\Chat\Core\Input;
use Tm\Chat\Core\Redirect;
use Tm\Chat\Core\Avatar;

class EditDataController { 

    private $auth, $templates, $input, $token, $db, $img;

    function __construct(Engine $templates, PdoDatabase $db, Auth $auth, Avatar $img) {
        $this->templates = $templates;
        $this->db = $db;
        $this->auth = $auth;
        $this->img = $img;
    }

    public function changepass_view(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            Redirect::to('/login');
        } else {
           
            echo $this->templates->render('changepass');
        }
    }

    public function changepass(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            Redirect::to('/login');
        } else {
            if(Input::exists()) {
                if(Token::check(Input::get('token'))) {
                    if ($_POST['new_pass'] === $_POST['new_pass_again']) {
                        try {
                            $this->auth->changePassword($_POST['current_pass'], $_POST['new_pass']);
                            Redirect::to('/');
                            //echo 'Password has been changed';
                        }
                        catch (\Delight\Auth\NotLoggedInException $e) {
                            $message = 'Not logged in';
                        }
                        catch (\Delight\Auth\InvalidPasswordException $e) {
                            $message = 'Invalid password(s)';
                        }
                        catch (\Delight\Auth\TooManyRequestsException $e) {
                            $message = 'Too many requests';
                        }
                    } else {
                        $message = 'Варианты нового пароля не совпадают.';    
                    }
                } else {
                    $message = 'Токен формы не прошел проверку';
                }
            } else {
                $message = 'Не заполнены поля формы';
            }

            echo $this->templates->render('changepass', [
                'message' => $message,
                'type' => 'error'
            ]);

        }
    }

    public function upload(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            Redirect::to('/login');
        } else {
            $result = 'Файла не существует';
            if(isset($_FILES['img'])) {
                $img = $this->img->getImage();
                $result = $this->img->putImage($_FILES['img']);
                if (($result) == true) {
                    $this->img->removeImage($img);
                    Redirect::to('/');
                } 
            } else {
                echo $this->templates->render('upload', [
                    'img' => '../public/uploads/avatar/' . $img,
                    'message' => $result,
                    'type' => 'error'
                ]);
            }
        }
    }

    public function upload_view(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            Redirect::to('/login');
        } else {
            $img = $this->img->getImage();
            echo $this->templates->render('upload', [
                'img' => '../public/uploads/avatar/' . $img
            ]);
        }
    }

    public function update_view(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            Redirect::to('/login');
        } else {
            $checked = $this->db->selectValue(
                'SELECT email_status FROM users WHERE id = ?',
                [
                    $this->auth->getUserId()
                ]
            );
            echo $this->templates->render('update', [
                'username' => $this->auth->getUsername(),
                'checked' => (!$checked ? 'checked' :  '')  
            ]);
        }
    }

    public function update(): void 
    {
        if (!$this->auth->isLoggedIn()) {
            Redirect::to('/login');
        } else {
            if(Input::exists()) {
                if(Token::check(Input::get('token'))) {
                        $username = $_POST['username'];
                       // if (isset($_POST['hidemail'])) {
                            $email_status = isset($_POST['hidemail']) ? 0 : 1;
                       // } else {
                      //      $email_status = 0;
                      //  }
                        $checked = $this->db->select(
                            'SELECT username FROM users WHERE username = ? AND id <> ?',
                            [
                                $username,
                                $this->auth->getUserId()
                            ]
                        );
                        if (!$checked) {
                            $this->db->exec(
                                "UPDATE users SET email_status = ? WHERE id = ?",
                                [
                                    $email_status,
                                    $this->auth->getUserId()
                                ]
                            );
                            if ($this->auth->getUsername() !=  $username) {
                                $this->db->exec(
                                    "UPDATE users SET username = ? WHERE id = ?",
                                    [
                                        $username,
                                        $this->auth->getUserId()
                                    ]
                                );
                            }
                            Redirect::to('/');
                        } else {
                            $message = 'Данное имя пользователя уже существует';
                        }
                } else {
                    $message = 'Токен формы не прошел проверку';
                }
            } else {
                $message = 'Не заполнены поля ввода';
            }
            $checked = $this->db->selectValue(
                    'SELECT email_status FROM users WHERE id = ?',
                    [
                        $this->auth->getUserId()
                    ]
            );
            echo $this->templates->render('update', [
                'username' => $this->auth->getUsername(),
                'checked' => ($checked ? 'checked' :  ''),
                'message' => $message,
                'type' => 'error'
            ]);
        }
    }
    

}