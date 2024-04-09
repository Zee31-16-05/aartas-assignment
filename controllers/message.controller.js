const Message = require('../models/message.model')

exports.sendMessage = async (req, res) => {
    try {
      const { sender, receiver, content } = req.body;
      console.log("sendMessage....", sender, receiver, content);
      const message = new Message({
        sender,
        receiver,
        content
      });
      await message.save();
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }