
class EventEmitter {
  constructor() {
    this._events = Object.create(null);
  }

  // 注册
  on(type, handler) {
    if (!this._events[type]) {
      this._events[type] = [];
    }
    this._events.push(handler);
  }

  // 注销
  off (type, handler) {
    if (this._events[type]) {
      this._events[type].splice(this._events[type].indexOf(handler) >>> 0, 1);
    }
  }
  
  // 注册单次事件
  once(type, handler) {
    // 标记
    let fired = false;
    function magic() {
      // 代理回调执行一次后就将自己注销
      this.off(type, magic);
      // handler 执行一次后标记就会置位
      if (!fired) {
        fired = true;
        handler.apply(this, arguments);
      }
    }
    // 不直接注册 handler 而是注册一个代理回调
    this.on(type, magic);
  }

  // 触发事件
  emit(type) {
    // 除 type 之外的所有参数
    let payload = [].slice.call(arguments, 1);
    let array = this._events[type] || [];
    // 调用每个注册的 handler
    for (let i = 0; i < array.length; i++) {
      let handler = this._events[type][i];
      handler.apply(this, payload);
    }
  }

}
