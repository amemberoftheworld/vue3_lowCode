import {
  computed,
  createVNode,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  render,
} from "vue";

export const DropdownItem = defineComponent({
  props: {
    label: String,
    icon: String,
  },
  setup(props) {
    let { label, icon } = props;
    let hide=inject('hide')
    return () => (
      <div class="dropdown-item" onClick={hide}>
        <i class={`iconfont icon-${icon}`}></i>
        <span>{label}</span>
      </div>
    );
  },
});

const DropdownComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false,
      top: 0,
      left: 0,
    });
    ctx.expose({
      showDropdown(option) {
        state.option = option;
        state.isShow = true;
        let { top, left, height } = option.el.getBoundingClientRect();
        state.top = top + height;
        state.left = left;
      },
    });
    provide("hide", () => (state.isShow = false));
    const classes = computed(() => ["dropdown", { "dropdown-isShow": state.isShow }]);
    const styles = computed(() => ({ top: `${state.top}px`, left: `${state.left}px` }));
    const el = ref(null);
    const onMousedownDocument = (e) => {
      if (!el.value.contains(e.target)) {
        state.isShow = false;
      }
    };
    onMounted(() => {
      document.body.addEventListener("mousedown", onMousedownDocument, true); //处理：当鼠标拖动元素，右键菜单会不动
    });
    onBeforeUnmount(() => {
      document.body.removeEventListener("mousedown", onMousedownDocument);
    });
    return () => {
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {state.option.content()}
        </div>
      );
    };
  },
});

let vm;
export function $dropdown(option) {
  if (!vm) {
    let el = document.createElement("div");
    vm = createVNode(DropdownComponent, { option });
    document.body.appendChild((render(vm, el), el));
  }

  let { showDropdown } = vm.component.exposed;
  showDropdown(option);
}
