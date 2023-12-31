<?php

namespace Tm\Chat\Core;

use FastRoute;
use DI\ContainerBuilder;
use PDO;
use Delight\Auth\Auth;
use Delight\Db\PdoDatabase;
use League\Plates\Engine;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use \Tm\Chat\Controllers\ChatController;
use \Tm\Chat\Controllers\LoginController;
use \Tm\Chat\Controllers\ErrorController;
use \Tm\Chat\Controllers\EditDataController;

class Router {

    public static function run() {

         $builder = new ContainerBuilder();
         $builder->addDefinitions([
             Engine::class => function() { 
                 return new Engine('../src/Templates');
             },

             PHPMailer::class => function() {
                return new PHPMailer(true);
             },   

             PDO::class => function() {
                 $driver = "mysql";
                 $host = "db2";
                 $database_name = "chat";
                 $username = "admin";
                 $password = "12345";
                 $mypdo = new PDO("$driver:host=$host;dbname=$database_name", $username, $password);
                 return $mypdo;
             },

             PdoDatabase::class => function($container) {
                 return PdoDatabase::fromPdo($container->get('PDO'));
              },

              Auth::class => function($container) {
                  return new Auth($container->get('PDO'));
             }

        ]); 

        $container = $builder->build();

         $dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
             $r->addRoute('GET', '/register', ['Tm\Chat\Controllers\LoginController', 'reg_form_view']);
             $r->addRoute('POST', '/register', ['Tm\Chat\Controllers\LoginController', 'isRegistration']);
             $r->addRoute('GET', '/register2', ['Tm\Chat\Controllers\LoginController', 'isRetryConfirm']);
             $r->addRoute('GET', '/update', ['Tm\Chat\Controllers\EditDataController', 'update_view']);
             $r->addRoute('POST', '/update', ['Tm\Chat\Controllers\EditDataController', 'update']);
             $r->addRoute('GET', '/upload', ['Tm\Chat\Controllers\EditDataController', 'upload_view']);
             $r->addRoute('POST', '/upload', ['Tm\Chat\Controllers\EditDataController', 'upload']);
             $r->addRoute('GET', '/changepass', ['Tm\Chat\Controllers\EditDataController', 'changepass_view']);
             $r->addRoute('POST', '/changepass', ['Tm\Chat\Controllers\EditDataController', 'changepass']);
             $r->addRoute('GET', '/login', ['Tm\Chat\Controllers\LoginController', 'login_form_view']);
             $r->addRoute('GET', '/logout', ['Tm\Chat\Controllers\LoginController', 'logout']);
             $r->addRoute('POST', '/login', ['Tm\Chat\Controllers\LoginController', 'login']);
             $r->addRoute('GET', '/verify_email', ['Tm\Chat\Controllers\LoginController', 'isConfirmRegistration']);
             $r->addRoute('GET', '/', ['Tm\Chat\Controllers\ChatController', 'chat_view']);
             $r->addRoute('GET', '/get/{action:\w+}', ['Tm\Chat\Controllers\ChatController', 'actionDB']);
             $r->addRoute('POST', '/post/{action:\w+}', ['Tm\Chat\Controllers\ChatController', 'actionDB']);
        
         });
        
        // // Fetch method and URI from somewhere
         $httpMethod = $_SERVER['REQUEST_METHOD'];
         $uri = $_SERVER['REQUEST_URI'];
        
        // // Strip query string (?foo=bar) and decode URI
         if (false !== $pos = strpos($uri, '?')) {
             $uri = substr($uri, 0, $pos);
         }
         $uri = rawurldecode($uri);
     
         $routeInfo = $dispatcher->dispatch($httpMethod, $uri);
         switch ($routeInfo[0]) {
             case FastRoute\Dispatcher::NOT_FOUND:
                 echo '404 Not Found';
                 break;
             case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
                 $allowedMethods = $routeInfo[1];
                 echo '405 Method Not Allowed';
                 break;
             case FastRoute\Dispatcher::FOUND:
                 $handler = $routeInfo[1];
                 $vars = $routeInfo[2];
                 $container->call($handler, [$vars]);
                 break;
        }    
    }
}