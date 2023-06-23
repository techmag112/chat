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
        if (e['id'] == state.userID) {
          state.groupStatusMyUser = status;
        }
        stateGroupChatInDB(id, status);
        // Синхронизация таблицы 
        let post = {
          command: "updatelist",
          message: state.listgroup,
          channel: "10001"
        };
        ws.send(JSON.stringify(post));
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
      if ((e.target.classList.contains('chatcontent_mymessage_text') || e.target.classList.contains('chatcontent_body--my')) && getIdOnClick(e) != 0) {
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
    if (link.getAttribute("data-action") != "switch" && state.groupStatusMyUser == 0 && state.currentchatid == '10001') {
      errorValue(".chatcontent");
    } else {
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
          forwardMessage(state.currentid);
          break;
      }
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
    modifyMessageInDB(id, state.currentchatid, "Данное сообщение удалено");
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
    modifyMessageInDB(id, state.currentchatid, status + newmessage);
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
    addMessageInDB(newIndex, Number(chatID), state.userID, message, getTimePost());
  }
  function getNewIndexCurrentChat(currentchat, chatId) {
    const array = currentchat.filter(item => item['chat_id'] == chatId);
    return ++array.length;
  }
  function addEditorListener() {
    listener1 = function () {
      if (inputSend.value !== '') {
        if (state.groupStatusMyUser == 0 && state.currentchatid == '10001') {
          errorValue();
        } else {
          let cleanMessage = inputSend.value; //DOMPurify.sanitize(inputSend.value); //, { USE_PROFILES: { html: true } });
          //if (cleanMessage == '') { cleanMessage = 'Удалено защитой от XSS'; }
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
        }

        inputSend.value = '';
        inputSend.focus();
      }
    };
    btnSend.addEventListener('click', listener1);
    listener2 = e => {
      if (inputSend.value !== '' && e.key === 'Enter') {
        if (state.groupStatusMyUser == 0 && state.currentchatid == '10001') {
          errorValue();
        } else {
          e.preventDefault();
          let cleanMessage = inputSend.value; //DOMPurify.sanitize(inputSend.value); //, { USE_PROFILES: { html: true } });
          //if (cleanMessage == '') { cleanMessage = 'Удалено защитой от XSS'; }
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
        }

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
  function forwardMessage(messageid) {
    overlayDiv();
    state.currentid = messageid;
    windowTransferFlag = true;
    windowListChatTag.classList.add('active');
    renderforwardWindow();
  }
  function renderforwardWindow() {
    let array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.arr;
    let chatList = [];
    chatList = array.filter(e => {
      return state.groupStatusMyUser != 0 ? e['chat_id'] < 10002 : e['chat_id'] < 10001;
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
      let forwardChatId = getIdOnClick(e);
      let message = '';
      state.currentchat.forEach(e => {
        if (e['id'] == state.currentid) {
          message = "Forward->" + e['message'];
        }
      });
      const newIndex = getNewIndexCurrentChat(state.currentchat, forwardChatId);
      state.currentchat[state.currentchat.length] = {
        "id": newIndex,
        "chat_id": Number(forwardChatId),
        "sender_id": state.userID,
        "message": message,
        "time_message": getTimePost(),
        "id1": state.userID,
        "id2": getReceiverUserId(Number(forwardChatId))
      };
      addMessageInDB(newIndex, Number(forwardChatId), state.userID, message, getTimePost());
      // Отправить другой стороне и в базу
      if (getReceiverUserId(Number(forwardChatId)) < 10000) {
        let post = {
          command: "message",
          to: getReceiverUserId(Number(forwardChatId)),
          from: state.userID,
          message: message
        };
        ws.send(JSON.stringify(post));
      } else {
        let post = {
          command: "groupchat",
          message: message,
          channel: "10001"
        };
        ws.send(JSON.stringify(post));
      }
      // ------------------------------
      closeOverlay();
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
    if (state.currentchatid == 10001 && state.groupStatusMyUser == 1) {
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
    if (state.groupStatusMyUser == 1) {
      alarmCheck(10001, 10001);
    }
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
    updateAlarm(chatId, state.arr[index]['alarm1'], state.arr[index]['alarm2']);
  }
  function stateGroupChatInDB(id, status) {
    axios({
      method: 'post',
      url: '/post/postGroupStatus',
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
  function addMessageInDB(id, chatid, send_id, message, time) {
    axios({
      method: 'post',
      url: '/post/putMessage',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      data: {
        "id": id,
        "chatid": chatid,
        "send_id": send_id,
        "message": message,
        "time": time
      }
    }).then(() => {
      console.log('Чат-сообщение ' + message + ' успешно загружено!');
    }).catch(function (error) {
      console.log(error);
    });
  }
  function modifyMessageInDB(id, chatid, message, time) {
    axios({
      method: 'post',
      url: '/post/updateMessage',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      data: {
        "id": id,
        "chatid": chatid,
        "message": message,
        "time": time
      }
    }).then(() => {
      console.log('Чат-сообщение ' + message + ' успешно загружено!');
    }).catch(function (error) {
      console.log(error);
    });
  }
  function updateAlarm(chatid, alarm1, alarm2) {
    axios({
      method: 'post',
      url: '/post/updateAlarm',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      data: {
        "chatid": chatid,
        "alarm1": alarm1,
        "alarm2": alarm2
      }
    }).then(() => {
      console.log('Аларм успешно обновлен!');
    }).catch(function (error) {
      console.log(error);
    });
  }
  function synchroGroupStatus(array) {
    array.forEach((item, index) => {
      state.listgroup[index]['group_status'] = item['group_status'];
      if (state.listgroup[index]['id'] == state.userID && state.groupStatusMyUser == 0 && state.listgroup[index]['group_status'] == 1) {
        state.groupStatusMyUser = 1;
        reRenderGroupChat();
      }
    });
    renderLeftPanel();
  }
  function reRenderGroupChat() {}
  function errorValue() {
    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.chatwindow_area';
    const errorDiv = document.querySelector(selector);
    errorDiv.style.border = '1px solid red';
    setTimeout(() => {
      // Удаляем слой через 1000 мс
      errorDiv.style.border = 'none';
    }, 1000);
  }

  // Обработка входящих сообщений
  ws.onmessage = e => {
    //console.log(e.data);
    let info = JSON.parse(e.data);
    switch (info.command) {
      case 'message':
        console.log(info);
        addReceiverMessageInChat(info.message, info.from);
        break;
      case 'groupchat':
        console.log(info);
        addReceiverMessageInGroupChat(info.message);
        break;
      case 'updatelist':
        console.log(info);
        synchroGroupStatus(info.message);
        break;
      case 'edit':
        console.log(info);
        modifyReceiverMessageInChat(Number(info.messageID), info.from, info.message);
        break;
      default:
        console.log('Default: ', info);
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
async function getState(state) {
  const dop = '';

  // function getUser() { 
  await axios.get('/get/getUserData' + dop).then(res => {
    setData(res.data[0].id, 'userID');
    setData(res.data[0].username, 'username');
    setData(res.data[0].avatar, 'avatar');
  }).catch(function (error) {
    console.log(error);
  });
  //};

  // function getListChats() {
  await axios.get('/get/getChatList' + dop).then(res => {
    let Arr = Object.entries(res.data);
    let i = 1;
    Arr.forEach((item, i) => {
      setList(item[1], [i + 1]);
    });
    console.log('state.arr', state.arr);
  });
  // }

  //  function getChatMessages()  {
  await axios.get('/get/getChatMessages' + dop).then(res => {
    let Arr = Object.entries(res.data);
    Arr.forEach((item, i) => {
      setMessage(item[1], [i]);
    });
    console.log('state.currentchat', state.currentchat);
  });
  // }

  //function getListGroup() {
  await axios.get('/get/getGroupStatus' + dop).then(res => {
    let Arr = Object.entries(res.data);
    Arr.forEach((item, i) => {
      if (item[1]['id'] == state.userID) {
        state.groupStatusMyUser = item[1]['group_status'];
        console.log('state.groupStatusMyUser ', state.groupStatusMyUser);
      }
      setListGroup(item[1], [i]);
    });
    console.log('state.listgroup', state.listgroup);
  });
  //}

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

  //getUser();
  //getListGroup();
  //getListChats(); 
  //getChatMessages();
}

;
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
  const layerChatList = document.querySelector('.sidebarleft_body');
  const chatContext = document.querySelector('.chatcontent');
  init();
  function init() {
    filterChatList();
    uploadMyAvatar();
    uploadMyNick();
    renderChatList(state.arr);
    clickChatList();
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
    if (state.currentchatid < 10001 || (state.currentchatid = 10001) && state.groupStatusMyUser == 1) {
      uploadChat(id);
    }
    // uploadLeftPanel();
  }

  function calcGroupSize() {
    let headerCount = document.querySelector(".header_info");
    let chatList = state.listgroup.filter(e => e["group_status"] == 1);
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
  function setAlarm(array) {
    if (array['id1'] == state.userID && state.userID != 10001) {
      return array['alarm2'] == 1 ? "fa-bell-o" : "fa-bell-slash-o";
    } else {
      return array['alarm1'] == 1 ? "fa-bell-o" : "fa-bell-slash-o";
    }
  }
  function renderChatList(array) {
    removeChatList();
    // sortChatList(); Сортировка чатов по времени сообщений
    array.forEach(user => {
      if (user['id1'] == state.userID || user['id2'] == state.userID || user['id1'] == 10001) {
        let alarm = setAlarm(user);
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
                                <span>${user['username']} </span><i class="fa ${alarm}" id="alarm"></i><span class="blink"></span> 
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




//import DOMPurify from 'isomorphic-dompurify';

let state = {
  userID: "",
  // current user ID
  username: "",
  // current username 
  avatar: "",
  groupStatusMyUser: 0,
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

state.arr[0] = {
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
window.addEventListener('DOMContentLoaded', () => {
 
  (0,_modules_getState__WEBPACK_IMPORTED_MODULE_0__["default"])(state).then(function () {
    return (0,_modules_hamburger__WEBPACK_IMPORTED_MODULE_1__["default"])();
  }).then(function () {
    return (0,_modules_renderChatComponets__WEBPACK_IMPORTED_MODULE_3__["default"])(state);
  }).then(function () {
    return (0,_modules_actionListeners__WEBPACK_IMPORTED_MODULE_2__["default"])(state, ws);
  }).then(function () {
    registerToWS(state.userID);
    console.log('Upload Init Data Done!');
  });

  const ws = new ReconnectingWebSocket("ws://localhost:8090");
  ws.debug = true;
  ws.timeoutInterval = 3000;
  
  ws.onopen = () => {
    // Открываем канал с сервером чата
    console.log("Websocket connection established! ");
  };  

  ws.onclose = () => {
    console.log("Websocket connection closed");
  };

  ws.onerror = error => {
    console.log(error);
  };

  function registerToWS(id) {
    // Регистрируем пользователя в чате
      ws.send(JSON.stringify({
        command: "register",
        userId: id
      })); 
      ws.send(JSON.stringify({
        command: "subscribe",
        channel: "10001"
      }));
      console.log('Reg ' + id + ' ok!');
  }

});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map