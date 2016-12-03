function renderTableCell(props: string): string {
  return `<td class="TableCell" data-text="${props}">${props}</td>`;
}

function renderTableRow(data: TableItemState): string {
  const props = data.props;
  const active = data.active ? " active" : "";

  let result = `<tr class="TableRow${active}" data-id="${data.id}">`;

  result += renderTableCell("#" + data.id);
  for (let i = 0; i < props.length; i++) {
    result += renderTableCell(props[i]);
  }

  return result + `</tr>`;
}

function renderTable(data: TableState): string {
  const items = data.items;

  let result = `<table class="Table"><tbody>`;

  for (let i = 0; i < items.length; i++) {
    result += renderTableRow(items[i]);
  }

  return result + `</tbody></table>`;
}

function renderAnimBox(props: AnimBoxState): string {
  const style = `border-radius:${props.time % 10}px;` +
    `background:rgba(0,0,0,${0.5 + ((props.time % 10) / 10)})`;

  return `<div class="AnimBox" style="${style}" data-id="${props.id}"></div>`;
}

function renderAnim(props: AnimState): string {
  const items = props.items;

  let result = `<div class="Anim">`;
  for (let i = 0; i < items.length; i++) {
    result += renderAnimBox(items[i]);
  }

  return result + `</div>`;
}

function renderTreeLeaf(props: TreeNodeState): string {
  return `<li class="TreeLeaf">${props.id}</li>`;
}

function renderTreeNode(data: TreeNodeState): string {
  let result = `<ul class="TreeNode">`;
  for (let i = 0; i < data.children.length; i++) {
    const n = data.children[i];
    result += n.container ? renderTreeNode(n) : renderTreeLeaf(n);
  }
  return result += `</ul>`;
}

function renderTree(props: TreeState): string {
  return `<div class="Tree">${renderTreeNode(props.root)}</div>`;
}

function renderMain(data: AppState): string {
  const location = data && data.location;

  let result = `<div class="Main">`;
  if (location === "table") {
    result += renderTable(data.table);
  } else if (location === "anim") {
    result += renderAnim(data.anim);
  } else if (location === "tree") {
    result += renderTree(data.tree);
  }
  return result + `</div>`;
}

uibench.init("Vanilla[innerHTML]", "1.0.0");

function handleClick(e: MouseEvent): void {
  if ((e.target as HTMLElement).className === "TableCell") {
    console.log("Click", (e.target as HTMLElement).getAttribute("data-text"));
    e.preventDefault();
    e.stopPropagation();
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.querySelector("#App");

  uibench.run(
    (state) => {
      container.innerHTML = renderMain(state);
      if (state.location === "table") {
        const cells = container.querySelectorAll(".TableCell");
        for (let i = 0; i < cells.length; i++) {
          (cells[i] as HTMLTableCellElement).onclick = handleClick;
        }
      }
    },
    (samples) => {
      document.body.innerHTML = "<pre>" + JSON.stringify(samples, null, " ") + "</pre>";
    }
  );
});
