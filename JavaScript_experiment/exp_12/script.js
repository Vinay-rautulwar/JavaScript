$(function () {
  const $taskList = $("#task-list");
  const $emptyMessage = $("#empty-message");

  // Read the saved list when the page opens.
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  // Save the current list and rebuild its visible DOM elements.
  function saveAndRenderTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    $taskList.empty();
    $emptyMessage.toggle(tasks.length === 0);

    tasks.forEach(function (task) {
      const $item = $("<li>").addClass("task-item").toggleClass("completed", task.completed);
      const $checkbox = $("<input>", {
        type: "checkbox",
        "aria-label": "Mark " + task.title + " as complete"
      }).prop("checked", task.completed).attr("data-id", task.id);

      $("<span>").addClass("task-title").text(task.title).appendTo($item);
      $("<span>")
        .addClass("task-status")
        .text(task.completed ? "Completed" : "Pending")
        .appendTo($item);

      const $actions = $("<div>").addClass("task-actions");
      $("<button>", { type: "button", text: "Edit" })
        .addClass("edit-button")
        .attr("data-id", task.id)
        .appendTo($actions);
      $("<button>", { type: "button", text: "Delete" })
        .addClass("delete-button")
        .attr("data-id", task.id)
        .appendTo($actions);

      $item.prepend($checkbox);
      $item.append($actions);
      $taskList.append($item);
    });
  }

  // Create a new pending task and let renderTasks add it to the page.
  function addTask(title) {
    tasks.push({
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      title: title,
      completed: false
    });
    saveAndRenderTasks();
  }

  $("#task-form").on("submit", function (event) {
    event.preventDefault();
    const title = $("#task-input").val().trim();

    if (title) {
      addTask(title);
      $("#task-input").val("").trigger("focus");
    }
  });

  // Delegate events so they also work for task rows rendered later.
  $taskList.on("change", 'input[type="checkbox"]', function () {
    const id = $(this).attr("data-id");
    const task = tasks.find(function (item) {
      return item.id === id;
    });

    if (task) {
      task.completed = $(this).is(":checked");
      saveAndRenderTasks();
    }
  });

  $taskList.on("click", ".edit-button", function () {
    const id = $(this).attr("data-id");
    const task = tasks.find(function (item) {
      return item.id === id;
    });

    if (!task) {
      return;
    }

    const updatedTitle = window.prompt("Edit your task:", task.title);
    if (updatedTitle !== null && updatedTitle.trim()) {
      task.title = updatedTitle.trim();
      saveAndRenderTasks();
    }
  });

  $taskList.on("click", ".delete-button", function () {
    const id = $(this).attr("data-id");
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveAndRenderTasks();
  });

  // Fetch a few example tasks and show them separately from the user's list.
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/todos",
    method: "GET",
    data: { _limit: 3 },
    dataType: "json"
  })
    .done(function (sampleTasks) {
      const $sampleList = $("#sample-list");
      $("#sample-message").text(sampleTasks.length ? "" : "No sample ideas are available right now.");

      sampleTasks.forEach(function (sampleTask) {
        const $item = $("<li>").addClass("sample-item");
        $("<span>").addClass("sample-title").text(sampleTask.title).appendTo($item);
        $("<span>")
          .addClass("sample-status")
          .text(sampleTask.completed ? "Example: completed" : "Example: pending")
          .appendTo($item);
        $("<button>", { type: "button", text: "Add" })
          .addClass("sample-add")
          .data("title", sampleTask.title)
          .appendTo($item);
        $sampleList.append($item);
      });
    })
    .fail(function () {
      $("#sample-message").text("Sample ideas could not be loaded. Please check your connection and refresh.");
    });

  $("#sample-list").on("click", ".sample-add", function () {
    addTask($(this).data("title"));
  });

  renderTasks();
});
