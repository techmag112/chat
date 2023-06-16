/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/actionListeners.js":
/*!*******************************************!*\
  !*** ./src/js/modules/actionListeners.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const actionListeners = (state, ws) => {
  // Объявление переменных
  let contextMenuLink = document.querySelectorAll(".context-menu__link");
  let contextMenuActive = "context-menu--active";
  let contextMenuActive2 = "context-menu2--active";
  let divUser = document.querySelector(".sidebarleft_body");
  let divPost = document.querySelector(".chatcontent");
  let menu;
  let menuState = 0;
  let menuWidth;
  let menuHeight;
  let windowWidth;
  let windowHeight;
  let clickCoords;
  let clickCoordsX;
  let clickCoordsY;
  let btnSend = document.querySelector('.chatmessage_send');
  let inputSend = document.querySelector('.chatwindow_newMessageInput');
  let windowEditFlag = false,
    windowTransferFlag = false;
  let shadowOverlay;
  let windowEditTag = document.querySelector('.layerEdit');
  let windowListChatTag = document.querySelector('.layerListChat');
  let listener1, listener2;
  let listForward = windowListChatTag.querySelector(".chatlistForward");
  let search = document.querySelector("#search3");
  const chatContext = document.querySelector(".chatcontent");
  let configWindow = document.querySelector(".configChat");
  let leftPanel = configWindow.querySelector(".chatlist");
  let rightPanel = configWindow.querySelector(".chatcontacts");
  init();
  function init() {
    inputSend.focus();
    LeftListener();
    RightListener();
    filterChatGroupList();
    renderLeftPanel();
    addForwardtListener();
    addEditorListener();
    addWindowEditListener();
    postListener();
    userListener();
    clickListener();
    contextMenuOffLeftClick();
    contextMenuOffRightClick();
    keyEscListener();
    resizeListener();
    filterForwardList();
  }
  function filterChatGroupList() {
    let search = document.querySelector("#search2");
    search.addEventListener("input", e => {
      renderLeftPanel(filterUserName(e.target.value, state.arr));
    });
  }
  function calcGroupSize() {
    let headerCount = document.querySelector(".header_info");
    let chatList = state.arr.filter(e => {
      return e['chat_id'] < 10000 && e["group_status"] == 1;
    });
    let text = state.username + '&#013;';
    chatList.forEach(e => {
      text += e['username'] + '&#013;';
    });
    headerCount.innerHTML = '';
    headerCount.innerHTML = `<span title="${text}">Участники: ${chatList.length + 1}</span>`;
  }
  function renderLeftPanel() {
    let array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.arr;
    removeLeftPanel();
    let rightarray = [];
    let leftarray = [];
    leftarray = array.filter(e => {
      return e['chat_id'] < 10000 && e["group_status"] == 0;
    });
    rightarray = state.arr.filter(e => {
      return e['chat_id'] < 10000 && e["group_status"] == 1;
    });
    if (state.currentchatid > 10000) {
      calcGroupSize();
    }
    leftarray.forEach(user => {
      leftPanel.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['chat_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                <div class="sidebarleft_owner">
                                    <span>${user['username']} </span>
                                </div>
                            </div>
                        </div>
                        `;
    });
    renderRightPanel(rightarray);
  }
  function setState(id, status) {
    state.arr.forEach(e => {
      if (e["chat_id"] == id) {
        e["group_status"] = status;
        // Отправить изменение на сервер
        if (status) {
          let post = {
            action: "subscribe",
            to: id,
            channel: "10001"
          };
          ws.send(JSON.stringify(post));
        } else {
          let post = {
            action: "unsubscribe",
            to: id,
            channel: "10001"
          };
          ws.send(JSON.stringify(post));
        }
        //-----------------------------
      }
    });
  }

  function renderRightPanel(array) {
    removeRightPanel();
    array.forEach(user => {
      rightPanel.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['chat_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                    <div class="sidebarleft_owner">
                                        <span>${user['username']} </span>
                                    </div>
                                </div>
                            </div>
                        `;
    });
  }
  function removeLeftPanel() {
    leftPanel.innerHTML = ``;
  }
  function removeRightPanel() {
    rightPanel.innerHTML = ``;
  }
  function LeftListener() {
    leftPanel.addEventListener("click", function (e) {
      let ItemIdContext = getIdOnClick(e);
      let search = document.querySelector("#search2");
      search.value = '';
      setState(ItemIdContext, true);
      renderLeftPanel(state.arr, ItemIdContext);
    });
  }
  function RightListener() {
    rightPanel.addEventListener("click", function (e) {
      let ItemIdContext = getIdOnClick(e);
      setState(ItemIdContext, false);
      renderLeftPanel(state.arr, ItemIdContext);
    });
  }
  function getIdOnClick(e) {
    let node = e.target;
    let id;
    do {
      hasAttr(node, "data-id") ? id = node.getAttribute("data-id") : node = node.parentNode;
    } while (!id);
    return id;
  }
  function hasAttr(element, attr) {
    if (typeof element === 'object' && element !== null && 'getAttribute' in element && element.hasAttribute(attr)) {
      return true;
    } else {
      return false;
    }
  }
  function keyEscListener() {
    window.onkeyup = function (e) {
      if (e.keyCode === 27) {
        // Esc
        toggleMenuOff();
      }
    };
  }
  function contextMenuOffLeftClick() {
    document.addEventListener("click", function () {
      if (menuState !== 0) {
        toggleMenuOff();
      }
    });
  }
  function contextMenuOffRightClick() {
    document.addEventListener("contextmenu", function () {
      if (menuState !== 0) {
        toggleMenuOff();
      }
    });
  }
  function userListener() {
    divUser.addEventListener("contextmenu", function (e) {
      if (!e.target.classList.contains('sidebarleft_body')) {
        state.currentid = getIdOnClick(e);
        toggleMenuOff();
        e.preventDefault();
        menu = document.querySelector(".context-menu2");
        toggleMenuOn2();
        positionMenu(e);
        e.stopPropagation();
      }
    });
  }
  function postListener() {
    divPost.addEventListener("contextmenu", function (e) {
      if (!e.target.classList.contains('chatcontent') && getIdOnClick(e) != 0) {
        state.currentid = getIdOnClick(e);
        toggleMenuOff();
        e.preventDefault();
        menu = document.querySelector(".context-menu");
        toggleMenuOn();
        positionMenu(e);
        e.stopPropagation();
      }
    });
  }
  function toggleMenuOn() {
    if (menuState !== 1) {
      menuState = 1;
      menu.classList.add(contextMenuActive);
    }
  }
  function toggleMenuOn2() {
    if (menuState !== 1) {
      menuState = 1;
      menu.classList.add(contextMenuActive2);
    }
  }
  function toggleMenuOff() {
    if (menuState !== 0) {
      menuState = 0;
      menu.classList.remove(contextMenuActive);
      menu.classList.remove(contextMenuActive2);
    }
  }
  function getPosition(e) {
    var posx = 0;
    var posy = 0;
    if (!e) {
      let e = window.event;
    }
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
      x: posx,
      y: posy
    };
  }
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;
    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    if (windowWidth - clickCoordsX < menuWidth) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }
    if (windowHeight - clickCoordsY < menuHeight) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }
  function resizeListener() {
    window.onresize = function (e) {
      toggleMenuOff();
    };
  }
  function clickListener() {
    contextMenuLink.forEach(function (element) {
      element.addEventListener("click", function (e) {
        e.preventDefault();
        actionByRightClick(e.target);
      });
    });
  }
  function actionByRightClick(link) {
    toggleMenuOff();
    switch (link.getAttribute("data-action")) {
      case "switch":
        toggleAlarm(state.currentid);
        break;
      case "delete":
        deleteMessage(state.currentid);
        break;
      case "edit":
        editMessage(state.currentid);
        break;
      case "forward":
        forwardMessage();
        break;
    }
  }
  function toggleAlarm(id) {
    const listContact = document.querySelector(".sidebarleft_body");
    let chatContact = listContact.querySelectorAll(".sidebarleft_contact_chat");
    chatContact.forEach(item => {
      if (item.getAttribute("data-id") === id) {
        // if ((user['id1'] == state.userID) || (user['id2'] == state.userID) || (user['id1'] == 10001)) { 
        // let alert = ((user['alert1'] === 1 && user['id1'] == state.userID) || (user['alert2'] === 1 && user['id2'] == state.userID)) ? "fa-bell-o" : "fa-bell-slash-o";
        let alarmTag = item.querySelector("#alarm");
        if (alarmTag.className === "fa fa-bell-o") {
          alarmTag.classList.remove("fa-bell-o");
          alarmTag.classList.add("fa-bell-slash-o");
          //state.arr.forEach((el) => {
          //  if(el["chat_id"] == id) {
          //    el["alert"] = "off";
          //  }    
          //});
          setFieldAlarm(id);
        } else {
          alarmTag.classList.remove("fa-bell-slash-o");
          alarmTag.classList.add("fa-bell-o");
          //state.arr.forEach((el) => {
          //  if(el["chat_id"] == id) {
          //    el["alert"] = "on";
          //  }    
          //});
          setFieldAlarm(id);
        }
      }
    });
  }
  function deleteMessage(id) {
    state.currentchat.forEach(e => {
      if (e['id'] == id && e['chat_id'] == state.currentchatid) {
        e['message'] = setMessage(id, "<i>Сообщение удалено</i>");
        let index = state.currentchat.findIndex(e => e.id == state.currentid);
        state.currentchat[index]["message"] = "<i>Сообщение удалено</i>";
      }
    });
    // Сообщить серверу и другому пользователю
    let post = {
      command: "edit",
      to: getReceiverUserId(),
      from: state.userID,
      message: "<i>Сообщение удалено</i>",
      messageID: id
    };
    ws.send(JSON.stringify(post));
  }
  function editMessage(id) {
    state.currentchat.forEach(e => {
      if (e['id'] == id && e['chat_id'] == state.currentchatid) {
        overlayDiv();
        windowEditFlag = true;
        windowEditTag.classList.add('active');
        windowEditTag.querySelector('.chatwindow_newMessageInput').value = e['message'];
      }
    });
  }
  function addWindowEditListener() {
    windowEditTag.querySelector('.chatmessage_send').addEventListener('click', e => {
      closeOverlay();
      let index = state.currentchat.findIndex(e => e.id == state.currentid);
      state.currentchat[index]["message"] = windowEditTag.querySelector('.chatwindow_newMessageInput').value;
      setMessage(state.currentid, windowEditTag.querySelector('.chatwindow_newMessageInput').value, '(ред) ');
      e.stopPropagation();
    });
    windowEditTag.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        closeOverlay();
        let index = state.currentchat.findIndex(e => e.id == state.currentid);
        state.currentchat[index]["message"] = windowEditTag.querySelector('.chatwindow_newMessageInput').value;
        setMessage(state.currentid, windowEditTag.querySelector('.chatwindow_newMessageInput').value, '(ред) ');
        e.stopPropagation();
      }
    });
  }
  function setMessage(id, newmessage) {
    let status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    const selector = "[data-id=" + '"' + id + '"]';
    divPost.querySelector(selector).innerHTML = `
          <div class="chatcontent_body chatcontent_body--my" data-id=${id}>
              <span class="chatcontent_mymessage_text"><b>${state.username}</b>: ${status}${newmessage}</span>
              <span class="chatcontent_mymessage_time">${getTimePost()}</span>
          </div>`;
    // Отправить другой стороне и в базу
    let post = {
      command: "edit",
      to: getReceiverUserId(),
      from: state.userID,
      message: status + newmessage,
      messageID: id
    };
    ws.send(JSON.stringify(post));
  }
  function getTimePost() {
    const subbed = new Date();
    const hour = subbed.getHours().toString().length < 2 ? '0' + subbed.getHours() : subbed.getHours();
    const min = subbed.getMinutes().toString().length < 2 ? '0' + subbed.getMinutes() : subbed.getMinutes();
    return `${hour}:${min}`;
  }
  function addMyMessageInChat(message) {
    let chatID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : state.currentchatid;
    const newIndex = getNewIndexCurrentChat(state.currentchat, chatID);
    const newMessage = `
              <div class="chatcontent_mymessage_wrapper chatcontent_mymessage">
                  <div class="chatcontent_body chatcontent_body--my" data-id=${newIndex}>
                      <span class="chatcontent_mymessage_text"><b>${state.username}</b>: ${message}</span>
                      <span class="chatcontent_mymessage_time">${getTimePost()}</span>
                  </div>
              </div>
      `;
    chatContext.insertAdjacentHTML("beforeend", newMessage);
    state.currentchat[state.currentchat.length] = {
      "id": newIndex,
      "chat_id": Number(chatID),
      "sender_id": state.userID,
      "message": message,
      "time_message": getTimePost(),
      "id1": state.userID,
      "id2": getReceiverUserId()
    };
  }
  function getNewIndexCurrentChat(currentchat, chatId) {
    const array = currentchat.filter(item => item['chat_id'] == chatId);
    return ++array.length;
  }
  function addEditorListener() {
    listener1 = function () {
      if (inputSend.value !== '') {
        addMyMessageInChat(inputSend.value);
        // Отправить другой стороне и в базу
        let username = state.username;
        if (state.currentchatid == '10001') {
          let post = {
            command: "groupchat",
            message: "<b>" + username + "</b>: " + inputSend.value,
            channel: "10001"
          };
          ws.send(JSON.stringify(post));
        } else {
          let post = {
            command: "message",
            to: getReceiverUserId(),
            from: state.userID,
            message: "<b>" + username + "</b>: " + inputSend.value
          };
          ws.send(JSON.stringify(post));
        }
        // --------------------------------
        inputSend.value = '';
        inputSend.focus();
      }
    };
    btnSend.addEventListener('click', listener1);
    listener2 = e => {
      if (inputSend.value !== '' && e.key === 'Enter') {
        e.preventDefault();
        addMyMessageInChat(inputSend.value);
        // Отправить другой стороне и в базу
        let username = state.username;
        if (state.currentchatid == '10001') {
          let post = {
            command: "groupchat",
            message: "<b>" + username + "</b>: " + inputSend.value,
            channel: "10001"
          };
          ws.send(JSON.stringify(post));
        } else {
          let post = {
            command: "message",
            to: getReceiverUserId(),
            from: state.userID,
            message: "<b>" + username + "</b>: " + inputSend.value
          };
          ws.send(JSON.stringify(post));
        }
        // --------------------------------
        inputSend.value = '';
        inputSend.focus();
      }
    };
    window.addEventListener('keydown', listener2);
  }
  function removeEditorListener() {
    btnSend.removeEventListener('click', listener1, false);
    window.addEventListener('keydown', listener2, false);
  }
  function overlayDiv() {
    if (!windowEditFlag && !windowTransferFlag) {
      shadowOverlay = document.createElement('div');
      shadowOverlay.classList.add('overlay__shadow');
      document.body.appendChild(shadowOverlay);
      shadowOverlay.classList.add('overlay__shadow--show');
      removeEditorListener();
      shadowOverlay.addEventListener('click', e => {
        if (e.target.classList.contains('overlay__shadow')) {
          closeOverlay();
        }
      });
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape' & (windowEditFlag || windowTransferFlag)) {
          closeOverlay();
        }
      });
    } else {
      shadowOverlay.classList.remove('overlay__shadow--show');
      shadowOverlay.classList.remove('overlay__shadow');
      document.body.removeChild(shadowOverlay);
      addEditorListener();
    }
  }
  function closeOverlay() {
    if (windowEditFlag || windowTransferFlag) {
      shadowOverlay.classList.remove('overlay__shadow--show');
      shadowOverlay.classList.remove('overlay__shadow');
      document.body.removeChild(shadowOverlay);
      windowEditTag.classList.remove('active');
      windowListChatTag.classList.remove('active');
      windowEditFlag = false;
      windowTransferFlag = false;
      addEditorListener();
    }
  }
  function forwardMessage() {
    overlayDiv();
    windowTransferFlag = true;
    windowListChatTag.classList.add('active');
    renderforwardWindow();
  }
  function renderforwardWindow() {
    let array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.arr;
    let chatList = [];
    chatList = array.filter(e => {
      return e['chat_id'] < 10002;
    });
    listForward.innerHTML = '';
    chatList.forEach(user => {
      if (user['chat_id'] != state.currentchatid) {
        listForward.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['chat_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                <div class="sidebarleft_owner">
                                    <span>${user['username']} </span>
                                </div>
                            </div>
                        </div>
                  `;
      }
    });
  }
  function addForwardtListener() {
    listForward.addEventListener("click", function (e) {
      e.stopPropagation();
      let ItemIdContext = getIdOnClick(e); // 
      state.currentchat.forEach(e => {
        if (e['id'] == state.currentid) {
          let message = "Forward->" + e['message'];
          const currentChatId = getReceiverChatIdfromMessageId(Number(ItemIdContext));
          state.currentchat[state.currentchat.length] = {
            "id": state.currentchat.length + 1,
            "chat_id": currentChatId,
            "sender_id": state.userID,
            "message": message,
            "time_message": getTimePost(),
            "id1": state.userID,
            "id2": getReceiverUserId(currentChatId)
          };
          closeOverlay();
        }
      });
      // Отправить другой стороне и в базу
      let post = {
        command: "message",
        to: getReceiverUserId(currentChatId),
        from: state.userID,
        message: message
      };
      ws.send(JSON.stringify(post));
      // ------------------------------
    });
  }

  function filterForwardList() {
    search.addEventListener("input", e => {
      renderforwardWindow(filterUserName(e.target.value, state.arr));
    });
  }
  function filterUserName(value, array) {
    return array.filter(it => it['username'].toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  function addReceiverMessageInChat(message, receiverUserId) {
    const newIndex = getNewIndexCurrentChat(state.currentchat, getReceiverChatIdfromUserId(receiverUserId));
    if (getReceiverChatIdfromUserId(receiverUserId) == state.currentchatid) {
      const newMessage = `
                            <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${newIndex}>
                                <div class="chatcontent_body">
                                    <span class="chatcontent_yourmessage_text">${message}</span>
                                    <span class="chatcontent_yourmessage_time">${getTimePost()}</span>
                                </div>
                            </div>
                        `;
      chatContext.insertAdjacentHTML("beforeend", newMessage);
    }
    alarmCheck(getReceiverChatIdfromUserId(receiverUserId), receiverUserId);
    state.currentchat[state.currentchat.length] = {
      "id": newIndex,
      "chat_id": getReceiverChatIdfromUserId(receiverUserId),
      "sender_id": receiverUserId,
      "message": message,
      "time_message": getTimePost(),
      "id1": receiverUserId,
      "id2": state.userID
    };
  }
  function modifyReceiverMessageInChat(id, receiverUserId, message) {
    if (getReceiverChatIdfromUserId(receiverUserId) == state.currentchatid) {
      const selector = "[data-id=" + '"' + id + '"]';
      divPost.querySelector(selector).innerHTML = `
              <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${id}>
                <div class="chatcontent_body">
                  <span class="chatcontent_yourmessage_text">${message}</span>
                  <span class="chatcontent_yourmessage_time">${getTimePost()}</span>
                </div>
              </div>
            `;
    }
    let index = state.currentchat.findIndex(e => e.id == id);
    alarmCheck(getReceiverChatIdfromUserId(receiverUserId), receiverUserId);
    state.currentchat[index] = {
      "id": id,
      "chat_id": getReceiverChatIdfromUserId(receiverUserId),
      "sender_id": receiverUserId,
      "message": message,
      "time_message": getTimePost(),
      "id1": receiverUserId,
      "id2": state.userID
    };
  }
  function getReceiverChatIdfromUserId(receiverUserId) {
    const array = state.arr.filter(item => {
      return item['id1'] == receiverUserId && item['id2'] == state.userID || item['id1'] == state.userID && item['id2'] == receiverUserId;
    });
    return array[0]['chat_id'];
  }
  function getReceiverChatIdfromMessageId(messageId) {
    const array = state.currentchat.filter(item => item["id"] == messageId);
    return array[0]['chat_id'];
  }
  function getReceiverUserId() {
    let chatId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.currentchatid;
    const array = state.arr.filter(item => item['chat_id'] == chatId);
    if (array[0]['id1'] == state.userID) {
      return array[0]['id2'];
    } else {
      return array[0]['id1'];
    }
  }
  function alarmCheck(chatId, userId) {
    let index = state.arr.findIndex(e => e.chat_id == chatId);
    if (state.arr[index]['id1'] == userId) {
      if (state.arr[index]['alarm1']) {
        alarmPlay();
      }
    } else {
      if (state.arr[index]['alarm2']) {
        alarmPlay();
      }
    }
  }
  function alarmPlay() {
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = '../public/wav/alarm.mp3';
    audio.play();
  }
  function setFieldAlarm(chatId) {
    let index = state.arr.findIndex(e => e.chat_id == chatId);
    if (state.arr[index]['id1'] == state.userID) {
      state.arr[index]['alarm2'] ? state.arr[index]['alarm2'] = 0 : state.arr[index]['alarm2'] = 1;
    } else {
      state.arr[index]['alarm1'] ? state.arr[index]['alarm1'] = 0 : state.arr[index]['alarm1'] = 1;
    }
  }

  // Обработка входящих сообщений
  ws.onmessage = e => {
    let info = JSON.parse(e.data);
    console.log(info);
    switch (info.command) {
      case 'message':
        addReceiverMessageInChat(info.message, info.from);
        break;
      case 'groupchat':
        addReceiverMessageInChat(info.message, info.from);
        break;
      case 'edit':
        modifyReceiverMessageInChat(Number(info.messageID), info.from, info.message);
        break;
      default:
        console.log(info);
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (actionListeners);

/***/ }),

/***/ "./src/js/modules/getState.js":
/*!************************************!*\
  !*** ./src/js/modules/getState.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const getState = state => {
  const urlQuery = '../src/App/'; //'../src/App/'  './App/'

  function getUser() {
    axios.get(urlQuery + `userData.php`).then(res => {
      setData(res.data[0].id, 'userID');
      setData(res.data[0].username, 'username');
      setData(res.data[0].avatar, 'avatar');
    }).catch(function (error) {
      console.log(error);
    });
  }
  ;
  function getListChats() {
    axios.get(urlQuery + `chatList.php`).then(res => {
      let Arr = Object.entries(res.data);
      Arr.forEach((item, i) => {
        setList(item[1], [i]);
      });
      console.log('state.arr', state.arr);
    });
  }
  function getChatMessages() {
    axios.get(urlQuery + `chatMessages.php`).then(res => {
      let Arr = Object.entries(res.data);
      Arr.forEach((item, i) => {
        setMessage(item[1], [i]);
      });
      console.log('state.currentchat', state.currentchat);
    });
  }
  function setData(arg, field) {
    state[field] = arg;
    console.log(field, state[field]);
  }
  function setMessage(arg, field) {
    state.currentchat[field] = arg;
  }
  function setList(arg, field) {
    state.arr[field] = arg;
  }
  getUser();
  getListChats();
  //state.arr[state.arr.length] = {"id": state.currentchat.length + 1, "owner_id": state.userID, "chat_id": 10001, "alarm": 1, "lasttime":"", "group_status": 0, "email": "Нет", "username": "Group Chat", "avatar": "avatar-m.png", "email_status" :1};
  //console.log('state.arr', state.arr);
  getChatMessages();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getState);

/***/ }),

/***/ "./src/js/modules/hamburger.js":
/*!*************************************!*\
  !*** ./src/js/modules/hamburger.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const hamburger = () => {
  let menuBtnLeft = document.querySelector('.header_left');
  let menuLeft = document.querySelector('.menuLeft');
  let menuBtnRight = document.querySelector('.header_right');
  let menuRight = document.querySelector('.menuRight');
  let openMenuLeft = false;
  let openMenuRight = false;
  let shadowOverlay;
  addListeners();
  function addListeners() {
    menuBtnLeft.addEventListener('click', function () {
      if (!openMenuRight) {
        overlayMenu();
        toogleLeftMenu();
      }
    });
    menuBtnRight.addEventListener('click', function () {
      if (!openMenuLeft) {
        overlayMenu();
        toogleRightMenu();
      }
    });
    window.addEventListener('click', e => {
      if (e.target.classList.contains('overlay__shadow')) {
        closeOverlay();
      }
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' & (openMenuLeft || openMenuRight)) {
        closeOverlay();
      }
    });
    document.querySelector('.chatcontent').scrollTo(0, document.body.scrollHeight);
  }
  function closeOverlay() {
    if (openMenuLeft) {
      overlayMenu();
      toogleLeftMenu();
    }
    if (openMenuRight) {
      overlayMenu();
      toogleRightMenu();
    }
  }
  function toogleLeftMenu() {
    !openMenuLeft ? openMenuLeft = true : openMenuLeft = false;
    menuLeft.classList.toggle('active');
    menuBtnLeft.classList.toggle('active');
  }
  function toogleRightMenu() {
    !openMenuRight ? openMenuRight = true : openMenuRight = false;
    menuRight.classList.toggle('active');
    menuBtnRight.classList.toggle('active');
  }
  function overlayMenu() {
    if (!openMenuRight & !openMenuLeft) {
      shadowOverlay = document.createElement('div');
      shadowOverlay.classList.add('overlay__shadow');
      document.body.appendChild(shadowOverlay);
      shadowOverlay.classList.add('overlay__shadow--show');
    } else {
      shadowOverlay.classList.remove('overlay__shadow--show');
      shadowOverlay.classList.remove('overlay__shadow');
      document.body.removeChild(shadowOverlay);
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hamburger);

/***/ }),

/***/ "./src/js/modules/renderChatComponets.js":
/*!***********************************************!*\
  !*** ./src/js/modules/renderChatComponets.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const renderChatComponets = state => {
  const layerChatList = document.querySelector(".sidebarleft_body");
  const chatContext = document.querySelector(".chatcontent");
  init();
  function init() {
    renderChatList(state.arr);
    filterChatList();
    clickChatList();
    uploadMyAvatar();
    uploadMyNick();
    reloadHeaderClickChat(state.arr[0]['chat_id']);
  }
  function uploadMyAvatar() {
    const blockMyAvatar = document.querySelector(".myavatar");
    blockMyAvatar.innerHTML = `
            <img class="myavatar-photo" src="${state.urlImg}${state.avatar}">
            <div class="camera"><a href="/upload" title="Сменить аватар">
                <i class="fa fa-camera-retro icon-camera"></i>
            </a></div>
        `;
  }
  function uploadMyNick() {
    const blockMyNick = document.querySelector(".mynick");
    blockMyNick.innerHTML = `
            <a href="/update" title="Редактировать профиль">${state.username}</i></a>
        `;
  }
  function reloadHeaderClickChat(id) {
    state.currentchatid = id;
    let user = state.arr.filter(e => {
      return e['chat_id'] == id;
    });
    const header = document.querySelector(".header_wrapper");
    const control = document.querySelector(".header_right");
    if (state.currentchatid < 10000) {
      header.innerHTML = `
            <div class="header_avatar">
                    <img class="avatar-photo" src="${state.urlImg}${user[0]['avatar']}">
            </div>
            <div class="header_title">
                <div class="header_owner">
                    <span>${user[0]['username']}</span>
                </div>
                <div class="header_info">
                    <span>Был(а) недавно</span>
                </div>
            </div>
            `;
      control.style = "opacity: 0";
    } else {
      header.innerHTML = `<div class="header_avatar">
                <img class="avatar-photo" src="${state.urlImg}${user[0]['avatar']}">
             </div>
             <div class="header_title">
                <div class="header_owner">
                    <span>${user[0]['username']}</span>
                </div>
                <div class="header_info">

                </div>
             </div>
            `;
      calcGroupSize();
      control.style = "opacity: 1";
    }
    uploadChat(id);
    // uploadLeftPanel();
  }

  function calcGroupSize() {
    let headerCount = document.querySelector(".header_info");
    let chatList = state.arr.filter(e => {
      return e['id1'] < 10000 && e["group_status"] == 1;
    });
    let text = state.username + '&#013;';
    chatList.forEach(e => {
      text += e['username'] + '&#013;';
    });
    headerCount.innerHTML = '';
    headerCount.innerHTML = `<span title="${text}">Участники: ${chatList.length + 1}</span>`;
  }
  function uploadChat(chatId) {
    removeChat();
    const array = state.currentchat.filter(item => item['chat_id'] == chatId);
    array.forEach(arr => {
      if (arr['sender_id'] == state.userID) {
        chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_mymessage" data-id=${arr["id"]}>
                            <div class="chatcontent_body chatcontent_body--my">
                                <span class="chatcontent_mymessage_text"><b>${state.username}</b>: ${arr['message']}</span>
                                <span class="chatcontent_mymessage_time">${arr['time_message']}</span>
                            </div>
                        </div>
                    `;
      } else {
        chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${arr["id"]}>
                            <div class="chatcontent_body">
                                <span class="chatcontent_yourmessage_text">${arr['message']}</span>
                                <span class="chatcontent_yourmessage_time">${arr['time_message']}</span>
                            </div>
                        </div>
                    `;
      }
    });
  }
  function removeChat() {
    chatContext.innerHTML = ``;
  }
  function clickChatList() {
    layerChatList.addEventListener("click", function (e) {
      let node = e.target;
      let id;
      do {
        hasAttr(node, "data-id") ? id = node.getAttribute("data-id") : node = node.parentNode;
      } while (!id);
      if (id) {
        reloadHeaderClickChat(id);
      }
    });
  }
  function hasAttr(element, attr) {
    if (typeof element === 'object' && element !== null && 'getAttribute' in element && element.hasAttribute(attr)) {
      return true;
    } else {
      return false;
    }
  }
  function renderChatList(array) {
    removeChatList();
    // sortChatList(); Сортировка чатов по времени сообщений
    array.forEach(user => {
      if (user['id1'] == state.userID || user['id2'] == state.userID || user['id1'] == 10001) {
        let alert = user['alarm1'] && user['id1'] == state.userID || user['alarm2'] && user['id2'] == state.userID ? "fa-bell-o" : "fa-bell-slash-o";
        layerChatList.innerHTML += `
                    <div class="sidebarleft_contact_chat" data-id="${user['chat_id']}">
                        <div class="sidebarleft_avatar">
                            <span class="avatar">
                                <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                <span class="status" data-status="on"></span> 
                            </span>
                            </div>
                            <div class="sidebarleft_title">
                            <div class="sidebarleft_owner">
                                <span>${user['username']} </span><i class="fa ${alert}" id="alarm"></i>
                            </div>
                            <div class="sidebarleft_lastpost">
                                <span>${user['email']}</span>
                            </div>
                        </div>
                    </div>
                    `;
      }
    });
  }
  function removeChatList() {
    layerChatList.innerHTML = ``;
  }
  function sortChatList() {
    state.arr.sort((a, b) => b.lasttime > a.lasttime ? 1 : -1);
  }
  function filterUserName(value, array) {
    return array.filter(it => it['username'].toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  function filterChatList() {
    let search = document.querySelector("#search");
    search.addEventListener("input", e => {
      renderChatList(filterUserName(e.target.value, state.arr));
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderChatComponets);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_getState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/getState */ "./src/js/modules/getState.js");
/* harmony import */ var _modules_hamburger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/hamburger */ "./src/js/modules/hamburger.js");
/* harmony import */ var _modules_actionListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/actionListeners */ "./src/js/modules/actionListeners.js");
/* harmony import */ var _modules_renderChatComponets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/renderChatComponets */ "./src/js/modules/renderChatComponets.js");




window.addEventListener('DOMContentLoaded', () => {
  let state = {
    userID: "",
    // current user ID
    username: "",
    // current username 
    avatar: "",
    arr: [],
    // array chat list
    currentchat: [],
    // array messeges current chat
    currentchatid: 0,
    // current chat id
    currentid: 0,
    // current id message
    urlImg: "../public/uploads/avatar/" //"../public/uploads/avatar/"  "../assets/img/avatar/"
  };

  const ws = new WebSocket("ws://localhost:8090");
  ws.onopen = e => {
    // Открываем канал с сервером чата
    console.log("Connection established! " + e);
  };

  //  conn.send(JSON.stringify({command: "subscribe", channel: "global"}));
  //  conn.send(JSON.stringify({command: "groupchat", message: "hello glob", channel: "global"}));
  // command: "groupchat", message: "hello glob", channel: "global"
  //  conn.send(JSON.stringify({command: "message", to: "1", from: "9", message: "it needs xss protection"}));
  // conn.send(JSON.stringify({command: "register", userId: 9}));

  (0,_modules_getState__WEBPACK_IMPORTED_MODULE_0__["default"])(state);
  setTimeout(function () {
    state.arr[state.arr.length] = {
      "id": 1,
      "chat_id": 10001,
      "id1": 10001,
      "alarm1": 1,
      "id2": 10001,
      "alarm2": 1,
      "lasttime": "10:31",
      "email": "нет",
      "username": "Group Chat",
      "avatar": "avatar-m.png",
      "email_status": 1,
      "group_status": 0
    };
    (0,_modules_hamburger__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_modules_renderChatComponets__WEBPACK_IMPORTED_MODULE_3__["default"])(state);
    (0,_modules_actionListeners__WEBPACK_IMPORTED_MODULE_2__["default"])(state, ws);
    ws.send(JSON.stringify({
      command: "register",
      userId: state.userID
    })); // Регистрируем пользователя в чате
    ws.send(JSON.stringify({
      action: "subscribe",
      to: 11,
      channel: "10001"
    }));
  }, 1000);
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map