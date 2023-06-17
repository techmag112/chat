/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/actionListeners.js":
/*!*******************************************!*\
  !*** ./src/js/modules/actionListeners.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
      renderLeftPanel(filterUserName(e.target.value, state.listgroup));
    });
  }
  function calcGroupSize() {
    let headerCount = document.querySelector(".header_info");
    let chatList = state.listgroup.filter(e => {
      return e["group_status"] == 1;
    });
    let text = ''; //state.username + '&#013;';
    chatList.forEach(e => {
      text += e['username'] + '&#013;';
    });
    headerCount.innerHTML = '';
    headerCount.innerHTML = `<span title="${text}">Участники: ${chatList.length}</span>`;
  }
  function renderLeftPanel() {
    let array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.listgroup;
    removeLeftPanel();
    let rightarray = [];
    let leftarray = [];
    leftarray = array.filter(e => {
      return e["group_status"] == 0;
    });
    rightarray = state.listgroup.filter(e => {
      return e["group_status"] == 1;
    });
    if (state.currentchatid > 10000) {
      calcGroupSize();
    }
    leftarray.forEach(user => {
      leftPanel.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['id']}">
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
    state.listgroup.forEach(e => {
      if (e["id"] == id) {
        e["group_status"] = status;
        stateGroupChatInDB(id, status);
      }
    });
  }
  function renderRightPanel(array) {
    removeRightPanel();
    array.forEach(user => {
      rightPanel.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['id']}">
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
      setState(ItemIdContext, 1);
      renderLeftPanel();
    });
  }
  function RightListener() {
    rightPanel.addEventListener("click", function (e) {
      let ItemIdContext = getIdOnClick(e);
      setState(ItemIdContext, 0);
      renderLeftPanel();
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
    // Закрытие всех всплывающих окон
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
        let alarmTag = item.querySelector("#alarm");
        if (alarmTag.className === "fa fa-bell-o") {
          alarmTag.classList.remove("fa-bell-o");
          alarmTag.classList.add("fa-bell-slash-o");
          setFieldAlarm(id);
        } else {
          alarmTag.classList.remove("fa-bell-slash-o");
          alarmTag.classList.add("fa-bell-o");
          setFieldAlarm(id);
        }
      }
    });
  }
  function deleteMessage(id) {
    state.currentchat.forEach(e => {
      if (e['id'] == id && e['chat_id'] == state.currentchatid) {
        e['message'] = setMessage(id, "Данное сообщение удалено");
        let index = state.currentchat.findIndex(e => e.id == state.currentid);
        state.currentchat[index]["message"] = "Данное сообщение удалено";
      }
    });
    // Сообщить серверу и другому пользователю
    let post = {
      command: "edit",
      to: getReceiverUserId(),
      from: state.userID,
      message: "Данное сообщение удалено",
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
              <span class="chatcontent_mymessage_text">${state.username}: ${status}${newmessage}</span>
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
                      <span class="chatcontent_mymessage_text">${state.username}: ${message}</span>
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
        let cleanMessage = DOMPurify.sanitize(inputSend.value); //, { USE_PROFILES: { html: true } });
        if (cleanMessage == '') {
          cleanMessage = 'Удалено защитой от XSS';
        }
        addMyMessageInChat(cleanMessage);
        // Отправить другой стороне и в базу
        let username = state.username;
        if (state.currentchatid == '10001') {
          let post = {
            command: "groupchat",
            message: username + ": " + cleanMessage,
            channel: "10001"
          };
          ws.send(JSON.stringify(post));
        } else {
          let post = {
            command: "message",
            to: getReceiverUserId(),
            from: state.userID,
            message: username + ": " + cleanMessage
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
        let cleanMessage = DOMPurify.sanitize(inputSend.value); //, { USE_PROFILES: { html: true } });
        if (cleanMessage == '') {
          cleanMessage = 'Удалено защитой от XSS';
        }
        addMyMessageInChat(cleanMessage);
        // Отправить другой стороне и в базу
        let username = state.username;
        if (state.currentchatid == '10001') {
          let post = {
            command: "groupchat",
            message: username + ": " + cleanMessage,
            channel: "10001"
          };
          ws.send(JSON.stringify(post));
        } else {
          let post = {
            command: "message",
            to: getReceiverUserId(),
            from: state.userID,
            message: username + ": " + cleanMessage
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
  function addReceiverMessageInGroupChat(message) {
    const newIndex = getNewIndexCurrentChat(state.currentchat, 10001);
    if (state.currentchatid == 10001) {
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
    alarmCheck(10001, 10001);
    state.currentchat[state.currentchat.length] = {
      "id": newIndex,
      "chat_id": 10001,
      "sender_id": 10001,
      "message": message,
      "time_message": getTimePost(),
      "id1": 10001,
      "id2": 10001
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
      if (state.arr[index]['alarm1'] == 1) {
        alarmPlay();
      }
    } else {
      if (state.arr[index]['alarm2'] == 1) {
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
  function stateGroupChatInDB(id, status) {
    axios({
      method: 'post',
      url: '../src/App/putlistgroup.php',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      data: {
        "id": id,
        "status": status
      }
    }).then(() => {
      console.log('Статусы групп чата успешно загружены!');
    }).catch(function (error) {
      console.log(error);
    });
  }

  // Обработка входящих сообщений
  ws.onmessage = e => {
    console.log(e.data);
    let info = JSON.parse(e.data);
    console.log(info);
    switch (info.command) {
      case 'message':
        addReceiverMessageInChat(info.message, info.from);
        break;
      case 'groupchat':
        addReceiverMessageInGroupChat(info.message);
        break;
      case 'updatelist':
        console.log('list', info.message);
        break;
      case 'edit':
        modifyReceiverMessageInChat(Number(info.messageID), info.from, info.message);
        break;
      default:
      //console.log(info);
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

"use strict";
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
  function getListGroup() {
    axios.get(urlQuery + `listGroup.php`).then(res => {
      let Arr = Object.entries(res.data);
      Arr.forEach((item, i) => {
        setListGroup(item[1], [i]);
      });
      console.log('state.listgroup', state.listgroup);
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
  function setListGroup(arg, field) {
    state.listgroup[field] = arg;
  }
  getUser();
  getListChats();
  getChatMessages();
  getListGroup();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getState);

/***/ }),

/***/ "./src/js/modules/hamburger.js":
/*!*************************************!*\
  !*** ./src/js/modules/hamburger.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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
    let text = ''; //state.username + '&#013;';
    chatList.forEach(e => {
      text += e['username'] + '&#013;';
    });
    headerCount.innerHTML = '';
    headerCount.innerHTML = `<span title="${text}">Участники: ${chatList.length}</span>`;
  }
  function uploadChat(chatId) {
    removeChat();
    const array = state.currentchat.filter(item => item['chat_id'] == chatId);
    array.forEach(arr => {
      if (arr['sender_id'] == state.userID) {
        chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_mymessage" data-id=${arr["id"]}>
                            <div class="chatcontent_body chatcontent_body--my">
                                <span class="chatcontent_mymessage_text">${state.username}: ${arr['message']}</span>
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
        let alert = user['alarm1'] == 1 && user['id1'] == state.userID || user['alarm2'] == 1 && user['id2'] == state.userID || user['alarm1'] == 1 && user['id1'] == 10001 ? "fa-bell-o" : "fa-bell-slash-o";
        let email = user['email_status'] == 0 ? 'Скрыт' : user['email'];
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
                                <span>${user['username']} </span><i class="fa ${alert}" id="alarm"></i><span class="blink"></span> 
                            </div>
                            <div class="sidebarleft_lastpost">
                                <span>${email}</span>
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

/***/ }),

/***/ "./node_modules/dompurify/dist/purify.js":
/*!***********************************************!*\
  !*** ./node_modules/dompurify/dist/purify.js ***!
  \***********************************************/
/***/ (function(module) {

/*! @license DOMPurify 3.0.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.0.3/LICENSE */

(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  const {
    entries,
    setPrototypeOf,
    isFrozen,
    getPrototypeOf,
    getOwnPropertyDescriptor
  } = Object;
  let {
    freeze,
    seal,
    create
  } = Object; // eslint-disable-line import/no-mutable-exports

  let {
    apply,
    construct
  } = typeof Reflect !== 'undefined' && Reflect;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return new Func(...args);
    };
  }

  const arrayForEach = unapply(Array.prototype.forEach);
  const arrayPop = unapply(Array.prototype.pop);
  const arrayPush = unapply(Array.prototype.push);
  const stringToLowerCase = unapply(String.prototype.toLowerCase);
  const stringToString = unapply(String.prototype.toString);
  const stringMatch = unapply(String.prototype.match);
  const stringReplace = unapply(String.prototype.replace);
  const stringIndexOf = unapply(String.prototype.indexOf);
  const stringTrim = unapply(String.prototype.trim);
  const regExpTest = unapply(RegExp.prototype.test);
  const typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return apply(func, thisArg, args);
    };
  }
  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return construct(func, args);
    };
  }
  /* Add properties to a lookup table */

  function addToSet(set, array, transformCaseFunc) {
    var _transformCaseFunc;

    transformCaseFunc = (_transformCaseFunc = transformCaseFunc) !== null && _transformCaseFunc !== void 0 ? _transformCaseFunc : stringToLowerCase;

    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    let l = array.length;

    while (l--) {
      let element = array[l];

      if (typeof element === 'string') {
        const lcElement = transformCaseFunc(element);

        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }
  /* Shallow clone an object */

  function clone(object) {
    const newObject = create(null);

    for (const [property, value] of entries(object)) {
      newObject[property] = value;
    }

    return newObject;
  }
  /* This method automatically checks if the prop is function
   * or getter and behaves accordingly. */

  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);

      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }

        if (typeof desc.value === 'function') {
          return unapply(desc.value);
        }
      }

      object = getPrototypeOf(object);
    }

    function fallbackValue(element) {
      console.warn('fallback value for', element);
      return null;
    }

    return fallbackValue;
  }

  const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']); // SVG

  const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
  const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']); // List of SVG elements that are disallowed by default.
  // We still need to know them so that we can do namespace
  // checks properly in case one wants to add them to
  // allow-list.

  const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
  const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']); // Similarly to SVG, we want to know all MathML elements,
  // even those that we disallow by default.

  const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
  const text = freeze(['#text']);

  const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);
  const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
  const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
  const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode

  const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
  const TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
  const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape

  const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape

  const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
  );
  const DOCTYPE_NAME = seal(/^html$/i);

  var EXPRESSIONS = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MUSTACHE_EXPR: MUSTACHE_EXPR,
    ERB_EXPR: ERB_EXPR,
    TMPLIT_EXPR: TMPLIT_EXPR,
    DATA_ATTR: DATA_ATTR,
    ARIA_ATTR: ARIA_ATTR,
    IS_ALLOWED_URI: IS_ALLOWED_URI,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE: ATTR_WHITESPACE,
    DOCTYPE_NAME: DOCTYPE_NAME
  });

  const getGlobal = () => typeof window === 'undefined' ? null : window;
  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {HTMLScriptElement} purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported or creating the policy failed).
   */


  const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    } // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.


    let suffix = null;
    const ATTR_NAME = 'data-tt-policy-suffix';

    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }

    const policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html) {
          return html;
        },

        createScriptURL(scriptUrl) {
          return scriptUrl;
        }

      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    const DOMPurify = root => createDOMPurify(root);
    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */


    DOMPurify.version = '3.0.3';
    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */

    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;
      return DOMPurify;
    }

    const originalDocument = window.document;
    const currentScript = originalDocument.currentScript;
    let {
      document
    } = window;
    const {
      DocumentFragment,
      HTMLTemplateElement,
      Node,
      Element,
      NodeFilter,
      NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
      HTMLFormElement,
      DOMParser,
      trustedTypes
    } = window;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
    const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
    const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
    const getParentNode = lookupGetter(ElementPrototype, 'parentNode'); // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.

    if (typeof HTMLTemplateElement === 'function') {
      const template = document.createElement('template');

      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    let trustedTypesPolicy;
    let emptyHTML = '';
    const {
      implementation,
      createNodeIterator,
      createDocumentFragment,
      getElementsByTagName
    } = document;
    const {
      importNode
    } = originalDocument;
    let hooks = {};
    /**
     * Expose whether this browser supports running the full DOMPurify.
     */

    DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
    const {
      MUSTACHE_EXPR,
      ERB_EXPR,
      TMPLIT_EXPR,
      DATA_ATTR,
      ARIA_ATTR,
      IS_SCRIPT_OR_DATA,
      ATTR_WHITESPACE
    } = EXPRESSIONS;
    let {
      IS_ALLOWED_URI: IS_ALLOWED_URI$1
    } = EXPRESSIONS;
    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    /* Allowed attribute names */

    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    /*
     * Configure how DOMPUrify should handle custom elements and their attributes as well as customized built-in elements.
     * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
     * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
     * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
     */

    let CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */

    let FORBID_TAGS = null;
    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */

    let FORBID_ATTR = null;
    /* Decide if ARIA attributes are okay */

    let ALLOW_ARIA_ATTR = true;
    /* Decide if custom data attributes are okay */

    let ALLOW_DATA_ATTR = true;
    /* Decide if unknown protocols are okay */

    let ALLOW_UNKNOWN_PROTOCOLS = false;
    /* Decide if self-closing tags in attributes are allowed.
     * Usually removed due to a mXSS issue in jQuery 3.0 */

    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */

    let SAFE_FOR_TEMPLATES = false;
    /* Decide if document with <html>... should be returned */

    let WHOLE_DOCUMENT = false;
    /* Track whether config is already set on this instance of DOMPurify. */

    let SET_CONFIG = false;
    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */

    let FORCE_BODY = false;
    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */

    let RETURN_DOM = false;
    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */

    let RETURN_DOM_FRAGMENT = false;
    /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */

    let RETURN_TRUSTED_TYPE = false;
    /* Output should be free from DOM clobbering attacks?
     * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
     */

    let SANITIZE_DOM = true;
    /* Achieve full DOM Clobbering protection by isolating the namespace of named
     * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
     *
     * HTML/DOM spec rules that enable DOM Clobbering:
     *   - Named Access on Window (§7.3.3)
     *   - DOM Tree Accessors (§3.1.5)
     *   - Form Element Parent-Child Relations (§4.10.3)
     *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
     *   - HTMLCollection (§4.2.10.2)
     *
     * Namespace isolation is implemented by prefixing `id` and `name` attributes
     * with a constant string, i.e., `user-content-`
     */

    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
    /* Keep element content when removing element? */

    let KEEP_CONTENT = true;
    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */

    let IN_PLACE = false;
    /* Allow usage of profiles like html, svg and mathMl */

    let USE_PROFILES = {};
    /* Tags to ignore content of when KEEP_CONTENT is true */

    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
    /* Tags that are safe for data: URIs */

    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
    /* Attributes safe for values like "javascript:" */

    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
    const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
    /* Document namespace */

    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    /* Allowed XHTML+XML namespaces */

    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    /* Parsing of strict XHTML documents */

    let PARSER_MEDIA_TYPE;
    const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
    const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
    let transformCaseFunc;
    /* Keep a reference to config to pass to hooks */

    let CONFIG = null;
    /* Ideally, do not touch anything below this line */

    /* ______________________________________________ */

    const formElement = document.createElement('form');

    const isRegexOrFunction = function isRegexOrFunction(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity


    const _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      /* Shield configuration object from tampering */


      if (!cfg || typeof cfg !== 'object') {
        cfg = {};
      }
      /* Shield configuration object from prototype pollution */


      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE; // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.

      transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
      /* Set configuration parameters */

      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = 'ALLOWED_NAMESPACES' in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), // eslint-disable-line indent
      cfg.ADD_URI_SAFE_ATTR, // eslint-disable-line indent
      transformCaseFunc // eslint-disable-line indent
      ) // eslint-disable-line indent
      : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), // eslint-disable-line indent
      cfg.ADD_DATA_URI_TAGS, // eslint-disable-line indent
      transformCaseFunc // eslint-disable-line indent
      ) // eslint-disable-line indent
      : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true

      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true

      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false

      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true

      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false

      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false

      RETURN_DOM = cfg.RETURN_DOM || false; // Default false

      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false

      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false

      FORCE_BODY = cfg.FORCE_BODY || false; // Default false

      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true

      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false

      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true

      IN_PLACE = cfg.IN_PLACE || false; // Default false

      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
      CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};

      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }

      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }

      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }

      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      /* Parse profile info */


      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [...text]);
        ALLOWED_ATTR = [];

        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      /* Merge configuration parameters */


      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }

      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }

        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      /* Add #text in case KEEP_CONTENT is set to true */


      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }
      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */


      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }
      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */


      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }

      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }

        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        } // Overwrite existing TrustedTypes policy.


        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY; // Sign local variables required by `sanitize`.

        emptyHTML = trustedTypesPolicy.createHTML('');
      } else {
        // Uninitialized policy, attempt to initialize the internal dompurify policy.
        if (trustedTypesPolicy === undefined) {
          trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        } // If creating the internal policy succeeded sign internal variables.


        if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
          emptyHTML = trustedTypesPolicy.createHTML('');
        }
      } // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.


      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    const MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
    const HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']); // Certain elements are allowed in both SVG and HTML
    // namespace. We need to specify them explicitly
    // so that they don't get erroneously deleted from
    // HTML namespace.

    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
    /* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */

    const ALL_SVG_TAGS = addToSet({}, svg$1);
    addToSet(ALL_SVG_TAGS, svgFilters);
    addToSet(ALL_SVG_TAGS, svgDisallowed);
    const ALL_MATHML_TAGS = addToSet({}, mathMl$1);
    addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
    /**
     *
     *
     * @param  {Element} element a DOM element whose namespace is being checked
     * @returns {boolean} Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */

    const _checkValidNamespace = function _checkValidNamespace(element) {
      let parent = getParentNode(element); // In JSDOM, if we're inside shadow DOM, then parentNode
      // can be null. We just simulate parent in this case.

      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: 'template'
        };
      }

      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);

      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }

      if (element.namespaceURI === SVG_NAMESPACE) {
        // The only way to switch from HTML namespace to SVG
        // is via <svg>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'svg';
        } // The only way to switch from MathML to SVG is via`
        // svg if parent is either <annotation-xml> or MathML
        // text integration points.


        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        } // We only allow elements that are defined in SVG
        // spec. All others are disallowed in SVG namespace.


        return Boolean(ALL_SVG_TAGS[tagName]);
      }

      if (element.namespaceURI === MATHML_NAMESPACE) {
        // The only way to switch from HTML namespace to MathML
        // is via <math>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'math';
        } // The only way to switch from SVG to MathML is via
        // <math> and HTML integration points


        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
        } // We only allow elements that are defined in MathML
        // spec. All others are disallowed in MathML namespace.


        return Boolean(ALL_MATHML_TAGS[tagName]);
      }

      if (element.namespaceURI === HTML_NAMESPACE) {
        // The only way to switch from SVG to HTML is via
        // HTML integration points, and from MathML to HTML
        // is via MathML text integration points
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }

        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        } // We disallow tags that are specific for MathML
        // or SVG and should never appear in HTML namespace


        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      } // For XHTML and XML documents that support custom namespaces


      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      } // The code should never reach this place (this means
      // that the element somehow got namespace that is not
      // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
      // Return false just in case.


      return false;
    };
    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */


    const _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });

      try {
        // eslint-disable-next-line unicorn/prefer-dom-node-remove
        node.parentNode.removeChild(node);
      } catch (_) {
        node.remove();
      }
    };
    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */


    const _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name); // We void attribute values for unremovable "is"" attributes

      if (name === 'is' && !ALLOWED_ATTR[name]) {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(node);
          } catch (_) {}
        } else {
          try {
            node.setAttribute(name, '');
          } catch (_) {}
        }
      }
    };
    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */


    const _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      let doc;
      let leadingWhitespace;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }

      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
        // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
      }

      const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /*
       * Use the DOMParser API by default, fallback later if needs be
       * DOMParser not work for svg when has multiple root element.
       */

      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {}
      }
      /* Use createHTMLDocument in case DOMParser is not available */


      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, 'template', null);

        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {// Syntax error if dirtyPayload is invalid xml
        }
      }

      const body = doc.body || doc.documentElement;

      if (dirty && leadingWhitespace) {
        body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      /* Work on whole document or just its body */


      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
      }

      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */


    const _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
    };
    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */


    const _isClobbered = function _isClobbered(elm) {
      return elm instanceof HTMLFormElement && (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function' || typeof elm.hasChildNodes !== 'function');
    };
    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */


    const _isNode = function _isNode(object) {
      return typeof Node === 'object' ? object instanceof Node : object && typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
    };
    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */


    const _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], hook => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };
    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */


    const _sanitizeElements = function _sanitizeElements(currentNode) {
      let content;
      /* Execute a hook if present */

      _executeHook('beforeSanitizeElements', currentNode, null);
      /* Check if element is clobbered or can clobber */


      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Now let's check the element's type and name */


      const tagName = transformCaseFunc(currentNode.nodeName);
      /* Execute a hook if present */

      _executeHook('uponSanitizeElement', currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      /* Detect mXSS attempts abusing namespace confusion */


      if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Remove element if anything forbids its presence */


      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Check if we have a custom element to handle */
        if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
        }
        /* Keep content except for bad-listed elements */


        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          const parentNode = getParentNode(currentNode) || currentNode.parentNode;
          const childNodes = getChildNodes(currentNode) || currentNode.childNodes;

          if (childNodes && parentNode) {
            const childCount = childNodes.length;

            for (let i = childCount - 1; i >= 0; --i) {
              parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
            }
          }
        }

        _forceRemove(currentNode);

        return true;
      }
      /* Check whether element has a valid namespace */


      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Make sure that older browsers don't get noscript mXSS */


      if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Sanitize element content to be template-safe */


      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR, ' ');
        content = stringReplace(content, ERB_EXPR, ' ');
        content = stringReplace(content, TMPLIT_EXPR, ' ');

        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      /* Execute a hook if present */


      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };
    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity


    const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }
      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */


      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if ( // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
          return false;
        }
        /* Check value is safe. First, is attr inert? If so, is safe */

      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
        return false;
      } else ;

      return true;
    };
    /**
     * _basicCustomElementCheck
     * checks if at least one dash is included in tagName, and it's not the first char
     * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
     * @param {string} tagName name of the tag of the node to sanitize
     */


    const _basicCustomElementTest = function _basicCustomElementTest(tagName) {
      return tagName.indexOf('-') > 0;
    };
    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */


    const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      let attr;
      let value;
      let lcName;
      let l;
      /* Execute a hook if present */

      _executeHook('beforeSanitizeAttributes', currentNode, null);

      const {
        attributes
      } = currentNode;
      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      const hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;
      /* Go backwards over all attributes; safely remove bad ones */

      while (l--) {
        attr = attributes[l];
        const {
          name,
          namespaceURI
        } = attr;
        value = name === 'value' ? attr.value : stringTrim(attr.value);
        lcName = transformCaseFunc(name);
        /* Execute a hook if present */

        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set

        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);

        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */

        if (hookEvent.forceKeepAttr) {
          continue;
        }
        /* Remove attribute */


        _removeAttribute(name, currentNode);
        /* Did the hooks approve of the attribute? */


        if (!hookEvent.keepAttr) {
          continue;
        }
        /* Work around a security issue in jQuery 3.0 */


        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);

          continue;
        }
        /* Sanitize attribute content to be template-safe */


        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR, ' ');
          value = stringReplace(value, ERB_EXPR, ' ');
          value = stringReplace(value, TMPLIT_EXPR, ' ');
        }
        /* Is `value` valid for this attribute? */


        const lcTag = transformCaseFunc(currentNode.nodeName);

        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }
        /* Full DOM Clobbering protection via namespace isolation,
         * Prefix id and name attributes with `user-content-`
         */


        if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
          // Remove the attribute with this value
          _removeAttribute(name, currentNode); // Prefix the value and later re-create the attribute with the sanitized value


          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        /* Handle attributes that require Trusted Types */


        if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
          if (namespaceURI) ; else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case 'TrustedHTML':
                {
                  value = trustedTypesPolicy.createHTML(value);
                  break;
                }

              case 'TrustedScriptURL':
                {
                  value = trustedTypesPolicy.createScriptURL(value);
                  break;
                }
            }
          }
        }
        /* Handle invalid data-* attribute set by try-catching it */


        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (_) {}
      }
      /* Execute a hook if present */


      _executeHook('afterSanitizeAttributes', currentNode, null);
    };
    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */


    const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      let shadowNode;

      const shadowIterator = _createIterator(fragment);
      /* Execute a hook if present */


      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);
        /* Sanitize tags and elements */


        if (_sanitizeElements(shadowNode)) {
          continue;
        }
        /* Deep shadow DOM detected */


        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }
        /* Check attributes, sanitize if necessary */


        _sanitizeAttributes(shadowNode);
      }
      /* Execute a hook if present */


      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };
    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity


    DOMPurify.sanitize = function (dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let body;
      let importedNode;
      let currentNode;
      let returnNode;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */

      IS_EMPTY_INPUT = !dirty;

      if (IS_EMPTY_INPUT) {
        dirty = '<!-->';
      }
      /* Stringify, in case dirty is an object */


      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        if (typeof dirty.toString === 'function') {
          dirty = dirty.toString();

          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        } else {
          throw typeErrorCreate('toString is not a function');
        }
      }
      /* Return dirty HTML if DOMPurify cannot run */


      if (!DOMPurify.isSupported) {
        return dirty;
      }
      /* Assign config vars */


      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      /* Clean up removed elements */


      DOMPurify.removed = [];
      /* Check if dirty is correctly typed for IN_PLACE */

      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) {
        /* Do some early pre-sanitization to avoid unsafe root nodes */
        if (dirty.nodeName) {
          const tagName = transformCaseFunc(dirty.nodeName);

          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
          }
        }
      } else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!---->');
        importedNode = body.ownerDocument.importNode(dirty, true);

        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        /* Initialize the document to work on */


        body = _initDocument(dirty);
        /* Check we have a DOM node from the data */

        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
        }
      }
      /* Remove first element node (ours) if FORCE_BODY is set */


      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      /* Get node iterator */


      const nodeIterator = _createIterator(IN_PLACE ? dirty : body);
      /* Now start iterating over the created document */


      while (currentNode = nodeIterator.nextNode()) {
        /* Sanitize tags and elements */
        if (_sanitizeElements(currentNode)) {
          continue;
        }
        /* Shadow DOM detected, sanitize it */


        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
        /* Check attributes, sanitize if necessary */


        _sanitizeAttributes(currentNode);
      }
      /* If we sanitized `dirty` in-place, return it. */


      if (IN_PLACE) {
        return dirty;
      }
      /* Return sanitized string or DOM */


      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-dom-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmod) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      /* Serialize doctype if allowed */

      if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
      }
      /* Sanitize final string template-safe */


      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR, ' ');
        serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */


    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);

      SET_CONFIG = true;
    };
    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */


    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };
    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */


    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */


    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };
    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     * @return {Function} removed(popped) hook
     */


    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        return arrayPop(hooks[entryPoint]);
      }
    };
    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */


    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };
    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */


    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  return purify;

}));
//# sourceMappingURL=purify.js.map


/***/ }),

/***/ "./node_modules/isomorphic-dompurify/browser.js":
/*!******************************************************!*\
  !*** ./node_modules/isomorphic-dompurify/browser.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = window.DOMPurify || (window.DOMPurify = (__webpack_require__(/*! dompurify */ "./node_modules/dompurify/dist/purify.js")["default"]) || __webpack_require__(/*! dompurify */ "./node_modules/dompurify/dist/purify.js"));

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_getState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/getState */ "./src/js/modules/getState.js");
/* harmony import */ var _modules_hamburger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/hamburger */ "./src/js/modules/hamburger.js");
/* harmony import */ var _modules_actionListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/actionListeners */ "./src/js/modules/actionListeners.js");
/* harmony import */ var _modules_renderChatComponets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/renderChatComponets */ "./src/js/modules/renderChatComponets.js");
/* harmony import */ var isomorphic_dompurify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! isomorphic-dompurify */ "./node_modules/isomorphic-dompurify/browser.js");
/* harmony import */ var isomorphic_dompurify__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(isomorphic_dompurify__WEBPACK_IMPORTED_MODULE_4__);





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
    listgroup: [],
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
      "alarm1": 0,
      "id2": 10001,
      "alarm2": 0,
      "lasttime": "",
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
      command: "subscribe",
      channel: "10001"
    }));
  }, 1000);
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map