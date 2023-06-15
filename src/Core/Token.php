<?php

namespace Tm\Chat\Core;

class Token {

    public static function generate() {
        return Session::put('token', md5(uniqid() . 'salt' . time()));
    }

    public static function check($token) {
        $tokenName = 'token';

        if(Session::exists($tokenName) && $token == Session::get($tokenName)) {
            Session::delete($tokenName);
            return true;
        }
        return false;
    }
    
}