new Vue({
  el: '#todo-list',
  data() {
    return {
      text: '',
      modalTitle: '',
      modalContent: '',
      dataList: [],
      visible: false,
      curIndex: 0,
    };
  },
  created() {
    this.initTask();
  },
  methods: {
    // 初始化
    initTask() {
      this.dataList = this.getLocalStorage('todoList') || [];
      this.initTimers();
    },
    initTimers() {
      this.dataList.forEach((item) => {
        // 初始化设置提醒
        if (item.remindTime && +new Date(item.remindTime) <= +new Date()) {
          alert(item.title);
          item.remindTime = '';
          this.setLocalStorage('todoList', this.dataList);
        } else if (+new Date(item.remindTime) > +new Date()) {
          item.timer = setInterval(() => {
            if (+new Date(item.remindTime) <= +new Date()) {
              clearInterval(item.timer);
              item.timer = null;
              alert(item.title);
              item.remindTime = '';
              this.setLocalStorage('todoList', this.dataList);
            }
          }, 1000);
        }
      });
    },
    // 输入文本
    inputText() {
      if (!this.text) {
        alert('请输入事件！');
      } else if (this.text.length > 20) {
        alert('输入文本过长！');
      } else {
        const dataObj = {
          title: this.text,
          detailText: '',
          remindTime: '',
          status: 0,
          timer: null,
        };
        this.dataList.unshift(dataObj);
        this.setLocalStorage('todoList', this.dataList);
        this.text = '';
      }
    },
    // 设置提醒
    setRemind(item) {
      const nowTime = +new Date();
      const remindTimeStamp = +new Date(item.remindTime);
      if (isNaN(remindTimeStamp)) {
        alert('格式错误，请重新输入！');
      } else if (remindTimeStamp <= nowTime) {
        alert('请确认提醒时间设置为当前时间之后！');
      }
      // 设置成功
      else {
        alert('已设置提醒时间');
        this.setLocalStorage('todoList', this.dataList);
        if (item.timer) {
          clearInterval(item.timer);
        }
        item.timer = setInterval(() => {
          if (remindTimeStamp <= +new Date()) {
            clearInterval(item.timer);
            item.timer = null;
            item.remindTime = '';
            this.setLocalStorage('todoList', this.dataList);
            alert(item.title);
          }
        }, 1000);
        // 更新缓存的timer
        this.setLocalStorage('todoList', this.dataList);
      }
    },
    // 删除事件
    deleteTask(index) {
      const confirmDel = confirm('请确认是否删除事件？');
      if (confirmDel) {
        this.dataList.splice(index, 1);
        this.setLocalStorage('todoList', this.dataList);
      }
    },
    // 转换完成情况
    toggleStatus(item) {
      if (item.status == 0) {
        item.status = 1;
        if (item.remindTime && item.timer) {
          clearInterval(item.timer);
          item.remindTime = '';
          item.timer = null;
        }
      } else if (item.status == 1) {
        item.status = 0;
      }
      this.setLocalStorage('todoList', this.dataList);
    },
    // 打开弹窗
    openMask(item, index) {
      this.curIndex = index;
      this.modalTitle = item.title;
      this.modalContent = item.detailText;
      this.visible = true;
    },
    // 更新数据
    update(content) {
      this.dataList[this.curIndex].detailText = content;
      this.setLocalStorage('todoList', this.dataList);
      this.visible = false;
    },
    // 缓存数据
    setLocalStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    // 获取缓存数据
    getLocalStorage(key) {
      return JSON.parse(localStorage.getItem(key));
    },
  },
});
