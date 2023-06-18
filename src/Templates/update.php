<?php 
    use function Tamtamchik\SimpleFlash\flash;
    use Tm\Chat\Core\Token;
    use Tm\Chat\Core\Session;

    if(isset($message)) {
        flash()->message($message, $type);
    } else {
        if (Session::exists('message')) {
            flash()->message(Session::get('message'), Session::get('type'));
            Session::delete('message');
            Session::delete('type');
        }
    }
    $this->layout('template', ['title' => 'Обновление профиля']); 
?>
<div class="container">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
<form action="" method="post" class="card p-2">

        <?php echo flash()->displayBootstrap(); ?>

        <div class="field" class="col-12">
            <label for="username" class="form-label">Имя пользователя</label>
            <input type="text" name="username" class="form-control" value="<?php echo $username ?>">
        </div>
        <br>
        <div>
            <input type="checkbox" id="hidemail" name="hidemail" <?= $checked?>>
            <label for="scales"> Скрыть email от других пользователей?</label>
        </div>
        <br>
        <input type="hidden" name="token" class="form-control" value="<?php echo Token::generate(); ?>"> 
        <div class="field">
            <button type="submit" class="w-100 btn btn-primary btn-lg">Обновить</button>
        </div>
</form>
</div>
