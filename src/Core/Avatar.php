<?php 

namespace Tm\Chat\Core;
use Delight\Db\PdoDatabase;
use Delight\Auth\Auth;

class Avatar {

	private $db, $auth, $imagesPath;

	function __construct(PdoDatabase $db, Auth $auth) {
        $this->db = $db;
        $this->auth = $auth;
		$this->imagesPath = './public/uploads/avatar/';
    }

	public function getImage() {
        $imgName = $this->db->selectValue(
                    'SELECT avatar FROM users WHERE id = ?',
                    [
                        $this->auth->getUserId()
                    ]
                );
        if ($imgName) {
             return $imgName;
        } else {
            return false;
        }
	}

	public function putImage($file) { 
		// если была произведена отправка формы
	    if(is_array($file)) {
			// проверяем, можно ли загружать изображение
			$check = $this->checkImage($file);
			if($check == true ){
			// загружаем изображение на сервер и в базу
				$nameFile = $this->uploadImage($file);
                return true;
			} else {
                return $check;
			}
		}
	}

	public function removeImage($name) {
		$uploaddir =  $_SERVER["DOCUMENT_ROOT"] . $imagesPath;
		if (file_exists($uploaddir . $name)) {
			unlink($uploaddir . $name);
		}
	}

	private function checkImage($file){
		// если имя пустое, значит файл не выбран
		if($file['name'] == '')
			return 'Вы не выбрали файл.';
		
		/* если размер файла 0, значит его не пропустили настройки 
		сервера из-за того, что он слишком большой */
		if(($file['size'] == 0))
			return 'Файл слишком большой.';
		
		// разбиваем имя файла по точке и получаем массив
		$getMime = explode('.', $file['name']);
		// нас интересует последний элемент массива - расширение файла
		$mime = strtolower(end($getMime));
		// объявим массив допустимых расширений
		$types = explode(",", 'jpg,png,bmp,gif');
		// если расширение не входит в список допустимых 
		if(!in_array($mime, $types)) 
			return 'Недопустимый тип файла.';
		// Иначе проверка пройдена!
		return true;
	}
  
  	private function uploadImage($file) {	
		$uploaddir =  $_SERVER["DOCUMENT_ROOT"] . $this->imagesPath;
		// формируем уникальное имя картинки: случайное число и name
		$nameFile = uniqid() . $file['name'];
		// Добавляем в базу 
        $this->db->exec(
            "UPDATE users SET avatar = ? WHERE id = ?",
            [
                $nameFile,
                $this->auth->getUserId()
            ]
        );
		// Заливаем файл
		move_uploaded_file( $file['tmp_name'],  $uploaddir . $nameFile);
		return $nameFile;
	}

}