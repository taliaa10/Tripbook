const socket = io()

const chatMessageTextBox = document.getElementById('chatMessageTextBox')
const sendButton = document.getElementById('sendButton')
const chatMessagesUL = document.getElementById('chatMessagesUL')

sendButton.addEventListener('click', () => {
  let chatMessage = chatMessageTextBox.value
  socket.emit('Houston', chatMessage)
})

socket.on('Houston', (message) => {
  let messageLI = `<li>${message}</li>`
  chatMessagesUL.insertAdjacentHTML('beforeend', messageLI)
  console.log(message)
})