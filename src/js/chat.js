
export default class Chat {
  constructor() {
    this.elErrorMessage = document.querySelector('#error_message');
    this.registration = document.querySelector('.registration');
    this.chat = document.querySelector('.chat')
    this.myName = "";
    this.ws = new WebSocket('ws://localhost:7070');
    this.usersList = document.querySelector('.users');
    this.messageControl = document.querySelector('.message_control');
    this.messageInput = document.querySelector('.message_input'); 
    this.chatMessages = document.querySelector('.chat_messages');
    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      switch (data.event) {
        case 'login':
          this.receivedLoginMessage(data);
          break;
        case 'newUser':
          this.refrеshUsers(data);
          break;
        case 'userOffline':
          this.refrеshUsers(data);
          break;
        case 'sendMessage':
          this.addMessage(data);
          break;
        default:
      }
    });
  }

  init() {
    this.registration.addEventListener('submit', this.login.bind(this));
    this.messageControl.addEventListener('submit', this.sendMessage.bind(this));
  }

  login(event) {
    event.preventDefault();
    this.elErrorMessage.innerText = '';
    const name = event.target.elements.login.value.trim();
    if (name === '') return;
    this.sendMessageToServer({
      event: 'login',
      name
    });
    this.registration.reset();
  };

  sendMessage(event) {
    event.preventDefault();
    const message = event.target.elements.message.value.trim();
    if (message === '') return;
    this.sendMessageToServer({
      event: 'sendMessage',
      name: this.myName,
      message
    });
    this.messageControl.reset();
  }

  sendMessageToServer(data) {
    this.ws.send(JSON.stringify(data));
  }

  receivedLoginMessage(data) {
    if (data.status) {
      this.myName = data.name;
      this.registration.classList.add('hidden');
      this.chat.classList.remove('hidden');
      this.sendMessageToServer({
        event: 'newUser',
        users: data.users
      });
    } else {
      this.elErrorMessage.innerText = data.message;;
    }
  }

  createUserElement(data) {
    const div = document.createElement('div');
    div.classList.add('user');
    const nameEl = document.createElement('p');
    nameEl.classList.add('name');
    nameEl.textContent = data.name;
    if (data.name === this.myName) {
      nameEl.classList.add('red');
    };
    const flagEl = document.createElement('div');
    flagEl.classList.add('flag');
    div.append(flagEl);
    div.append(nameEl);
    return div;
  }

  refrеshUsers(data) {
    this.usersList.innerHTML = '';
    data.users.forEach((user) => {
      const newUserElement = this.createUserElement(user);
      this.usersList.append(newUserElement);
    })
  }

  addMessage(data) {
    const { name, message, date } = data;
    const messageEl = this.createMessageElement(name, message, date);
    if (name === this.myName) {
      messageEl.classList.add('myMassege');
    }
    this.chatMessages.append(messageEl);
  }

  createMessageElement(name, message, date) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    const messageHeaderEl = document.createElement('div');
    messageHeaderEl.classList.add('message_header');
    const nickNameEl = document.createElement('p');
    nickNameEl.classList.add('message_name');
    nickNameEl.textContent = name + ',';
    const dateEl = document.createElement('p');
    dateEl.classList.add('message_date');
    dateEl.textContent = date;
    const messageTextEl = document.createElement('p');
    messageTextEl.classList.add('message_text');
    messageTextEl.textContent = message;
    messageHeaderEl.append(nickNameEl);
    messageHeaderEl.append(dateEl);
    messageEl.append(messageHeaderEl);
    messageEl.append(messageTextEl);
    return messageEl;
  }

}





   
