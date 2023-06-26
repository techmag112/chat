<?php 

   $this->layout('template chat', ['title' => 'Супер-пупер-чат']); 

?>
<div class="container">
  <div class="chatwindow_header">
    <div class="header_wrapper">
        <!-- Тут текст шапки --> 
    </div>
    <div class="header_right">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div class="chatcontent">
        <!-- Тут текст текущего чата -->  
  </div>
  <div class="sidebarleft">
    <div class="sidebarleff_header">
        <div class="header_left">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="header_left_search">
          <i class="fa fa-search"></i><input type="search" id="search" pattern="^.*[^A-zА-яЁё].*$" placeholder="...Search">
        </div>
    </div>
    <div class="sidebarleft_body">
          <!-- Тут список чатов -->
    </div>
    <div class="status off">Чат-сервер</div>
  </div>
  <div class="chatwindow_editor">
    <div class="chatwindow_area">
      <div class="chatwindow_newMessageArea">
        <div class="chatwindow_control">
          <i class="fa fa-file-o chatwindow_icon"></i>
          <i class="fa fa-smile-o chatwindow_icon"></i>
          <input type="text" class="chatwindow_newMessageInput" placeholder=" Введите свое сообщение..."/>
        </div>
        <div class="chatmessage_send">
          <i class="fa fa-paper-plane chatwindow_icon"></i> 
        </div>
      </div>
    </div>
  </div>
</div>
<div class="menuLeft">
  <div class="myavatar">
   <!-- Тут мой аватар -->
  </div>
  <div class="mynick">
    <!-- Тут мой ник -->
  </div>
  <div class="menuLeft_nav">
      <nav>
        <ul>
            <li><a href="/changepass"><i class="fa fa-key"></i> Обновить пароль</a></li>
            <li><a href="/logout"><i class="fa fa-sign-out"></i> Выход</a></li>
        </ul>
      </nav>
  </div>
</div>
<div class="menuRight">
  <div class="menuRight_nav">
      <div class="configChat">
        <div class="leftpanel">
          <div class="header_left_search">
            <i class="fa fa-search"></i><input type="search" id="search2" pattern="^.*[^A-zА-яЁё].*$" placeholder="...Search">
          </div>
          <div class="chatlist">
            <!-- Тут генерируется список чатов -->
          </div>
        </div>
        <div class="trasfer">
          &nbsp;&nbsp;<i class="fa fa-exchange fa-2x" aria-hidden="true"></i>
        </div>
        <div class="rightpanel">
          <div class="groupchat_header">
            <span>Group Chat</span>
          </div>
          <div class="chatcontacts">

          </div>
        </div>
      </div>
  </div>
</div>
<div class="context-menu">
  <ul class="dropdown-menu">
    <li class="context-menu__item">
      <a class="context-menu__link" data-action="edit"><i class="fa fa-pencil fa-fw"></i> Редактировать</a>
    </li>
    <li class="context-menu__item">
      <a class="context-menu__link" data-action="forward"><i class="fa fa-share"></i> Переслать</a>
    </li>
    <li class="context-menu__item">
      <a class="context-menu__link" data-action="delete"><i class="fa fa-ban"></i> Удалить</a>
    </li>
  </ul>
</div>
<div class="context-menu2">
  <ul class="dropdown-menu">
    <li class="context-menu__item">
      <a class="context-menu__link" data-action="switch"><i class="fa fa-exchange"></i> Вкл/выкл оповещение</a>
    </li>
  </ul>
</div>
<div class="layerEdit">
  <div class="chatwindow_area">
    <div class="chatwindow_newMessageArea">
      <div class="chatwindow_control">
        <i class="fa fa-file-o chatwindow_icon"></i>
        <i class="fa fa-smile-o chatwindow_icon"></i>
        <input type="text" class="chatwindow_newMessageInput"/>
      </div>
      <div class="chatmessage_send">
        <i class="fa fa-paper-plane chatwindow_icon"></i> 
      </div>
    </div>
  </div>
</div>
<div class="layerListChat">
  <div class="panelForward">
    <div class="header_left_search">
      <i class="fa fa-search"></i><input type="search" id="search3" pattern="^.*[^A-zА-яЁё].*$" placeholder="...Search">
    </div>
    <div class="chatlistForward">
      <!-- Тут генерируется список чатов -->
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="public/ws/reconnecting-websocket.min.js"></script>
<script src="public/js/script.js"></script>