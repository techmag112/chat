
<?php 
    use function Tamtamchik\SimpleFlash\flash;
    use Tm\Chat\Core\Token;
    use Tm\Chat\Core\Input;

    if(isset($message)) {
        flash()->message($message, $type);
    }
    $this->layout('template', ['title' => 'Авторизация']); 
?>

<div class="container">
<form action="" method="post" class="card p-2">
        
        <?php echo flash()->displayBootstrap(); ?> 

        <div class="field" class="col-12">
            <label for="email" class="form-label">Email</label>
            <input type="text" name="email" class="form-control" value="<?php echo Input::get('email')?>">
        </div>

        <div class="field" class="col-12">
            <label for="" class="form-label">Password</label>
            <input type="password" name="password" class="form-control">
        </div>

        <br>      
        <input type="hidden" name="token" class="form-control" value="<?php echo Token::generate(); ?>"> 
        <div class="field">
            <button type="submit" class="w-100 btn btn-primary btn-lg">Авторизоваться</button>
        </div>
        <br>  
        <span align="center" class="text">Нет аккаунта?</span> <a align="center" href="/register">Зарегистрироваться</a>  
</form>
</div>