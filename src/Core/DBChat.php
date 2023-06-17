<?php

namespace Tm\Chat\Core;

use PDO;
use Delight\Db\PdoDatabase;

class DBChat {
    
    private static $db;

    public function __construct() {
        self::$db = \Delight\Db\PdoDatabase::fromDsn(
            new \Delight\Db\PdoDsn(
                'mysql:dbname=chat;host=localhost',
                'root',
                ''
            )
        );
    }

    static public function getListGroup($id, $status) {
        self::$db->update(
            'users',
            [
                // set
                'group_status' => $status
            ],
            [
                // where
                'id' => $id
            ]
        );
    }

}