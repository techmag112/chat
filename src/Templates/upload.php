<?php 
    use function Tamtamchik\SimpleFlash\flash;
    use \Tm\Chat\Core\Token;

    if(isset($message)) {
        flash()->message($message, $type);
    }
    $this->layout('template', ['title' => 'Обновление аватара']); 
?>
<div class="container">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
<form action="" method="post" class="card p-2" enctype="multipart/form-data">

        <?php echo flash()->displayBootstrap(); ?>

        <div class="field" class="col-12">
            <img src="<?php echo $img ?>" width="100" height="100">
        </div>
        <div class="field" class="col-12">
            <input type="file" name="img" class="form-control">
        </div>
        <br>
        <input type="hidden" name="token" class="form-control" value="<?php echo Token::generate(); ?>"> 
        <div class="field">
            <button type="submit" class="w-100 btn btn-primary btn-lg">Обновить</button>
        </div>
</form>
</div>
