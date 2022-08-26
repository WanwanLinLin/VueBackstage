const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  XAPIKEY: state => state.user.XAPIKEY,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
