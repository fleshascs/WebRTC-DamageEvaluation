export default (req, res) => {
  res.status(200).json({ text: "Hello" });
};
// useful when wrapping the Janus API
//https://janus.conf.meetecho.com/docs/auth.html
