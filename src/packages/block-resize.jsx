import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: Object,
    component: Object,
  },
  setup(props) {
    const { width, height } = props.component.resize || {};
    let data = {};
    const onMousemove = (e) => {
      let { clientX, clientY } = e;
      let { startX, startY, startWidth, startHeight, startLeft, startTop, direction } = data;

      if (direction.horizontal == "center") {
        clientX = startX;
      }
      if (direction.vertical == "center") {
        clientY = startY;
      }
      let durX = clientX - startX;
      let durY = clientY - startY;

      if (direction.vertical == "start") {
        durY = -durY;
        props.block.top = startTop - durY;
      }

      if (direction.horizontal == "start") {
        durX = -durX;
        props.block.left = startLeft - durX;
      }

      const width = startWidth + durX;
      const height = startHeight + durY;
      props.block.width = width;
      props.block.height = height;
      props.block.hasResize = true;
    };
    const onMouseup = () => {
      document.body.removeEventListener("mousemove", onMousemove);
      document.body.removeEventListener("mouseup", onMouseup);
    };
    const onMousedown = (e, direction) => {
      e.stopPropagation();
      data = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startLeft: props.block.left,
        startTop: props.block.top,
        direction,
      };

      document.body.addEventListener("mousemove", onMousemove);
      document.body.addEventListener("mouseup", onMouseup);
    };

    return () => (
      <>
        {width && (
          <>
            <div
              class="block-resize block-resize-left"
              onMousedown={(e) => onMousedown(e, { horizontal: "start", vertical: "center" })}
            ></div>
            <div
              class="block-resize block-resize-right"
              onMousedown={(e) => onMousedown(e, { horizontal: "end", vertical: "center" })}
            ></div>
          </>
        )}
        {height && (
          <>
            <div
              class="block-resize block-resize-top"
              onMousedown={(e) => onMousedown(e, { horizontal: "center", vertical: "start" })}
            ></div>
            <div
              class="block-resize block-resize-bottom"
              onMousedown={(e) => onMousedown(e, { horizontal: "center", vertical: "end" })}
            ></div>
          </>
        )}

        {width && height && (
          <>
            <div
              class="block-resize block-resize-top-left"
              onMousedown={(e) => onMousedown(e, { horizontal: "start", vertical: "start" })}
            ></div>
            <div
              class="block-resize block-resize-top-right"
              onMousedown={(e) => onMousedown(e, { horizontal: "end", vertical: "start" })}
            ></div>
            <div
              class="block-resize block-resize-bottom-left"
              onMousedown={(e) => onMousedown(e, { horizontal: "start", vertical: "end" })}
            ></div>
            <div
              class="block-resize block-resize-bottom-right"
              onMousedown={(e) => onMousedown(e, { horizontal: "end", vertical: "end" })}
            ></div>
          </>
        )}
      </>
    );
  },
});
