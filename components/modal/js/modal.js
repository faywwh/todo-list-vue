Vue.component('modal', {
  template: `
<div class="modal-mask" v-show="visible" @click="close">
  <div class="modal-dialog" :style="dialogStyle" @click.stop>
    <div class="modal-content">
      <div class="modal-header" ref="header">
        <div class="modal-title">{{title}}</div>
          <span class="modal-close" @click="close">×</span>
        </div>
      <div class="modal-body" :style="bodyStyle">
        <textarea v-model="desc" class="form-control" rows="3" @keyup.enter="confirm"></textarea>
      </div>
      <div class="modal-footer" ref="footer">
        <button type="button" class="btn btn-cancel" @click="cancel">{{cancelText}}</button>
        <button type="button" class="btn btn-confirm" @click="confirm">{{confirmText}}</button>
      </div>
    </div>
  </div>
</div>`,
  props: {
    visible: {
      type: Boolean,
      defalut: false,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 600,
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    confirmText: {
      type: String,
      default: '确认',
    },
  },
  computed: {
    dialogStyle() {
      return {
        width: `${this.width}px`,
      };
    },
    bodyStyle() {
      return {
        'max-height': `${this.maxHeight}px`,
      };
    },
  },
  watch: {
    content: {
      handler(newVal) {
        this.desc = newVal;
      },
      immediate: true,
    },
    // content(newVal) {
    //   this.desc = newVal;
    // },
  },
  data() {
    return {
      desc: '',
      maxHeight: 0,
    };
  },
  mounted() {
    this.initMaxHeight();
  },
  methods: {
    initMaxHeight() {
      const documentHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      const headerHeight = this.$refs.header.clientHeight;
      const footerHeight = this.$refs.footer.clientHeight;
      this.maxHeight = documentHeight - headerHeight - footerHeight - 180;
    },
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm', this.desc);
    },
    close() {
      this.$emit('close');
    },
  },
});
