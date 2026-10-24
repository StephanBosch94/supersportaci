function bindForm(form) {
  if (form.dataset.bound === "1") return;
  form.dataset.bound = "1";

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      event.stopPropagation();

      var block = form.closest(".w-form");
      var done = block && block.querySelector(".w-form-done");
      var fail = block && block.querySelector(".w-form-fail");
      var button = form.querySelector('[type="submit"]');
      var waitText = button && button.getAttribute("data-wait");
      var originalText = button && button.value;

      if (fail) fail.style.display = "none";
      if (button) {
        button.disabled = true;
        if (waitText) button.value = waitText;
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Formspree rejected the submission");
          form.reset();
          form.style.display = "none";
          if (done) done.style.display = "block";
        })
        .catch(function () {
          if (fail) fail.style.display = "block";
          if (button) {
            button.disabled = false;
            button.value = originalText;
          }
        });
    },
    true
  );
}

window.bindTermForms = function (root) {
  root.querySelectorAll("form.terminform").forEach(bindForm);
  root.querySelectorAll(".slot-button").forEach(function (button) {
    if (button.dataset.bound === "1") return;
    button.dataset.bound = "1";
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var slot = button.closest(".time-slot");
      var block = slot && slot.nextElementSibling;
      if (!block || !block.classList.contains("form-block")) return;
      var willOpen = block.style.display !== "flex";
      root.querySelectorAll(".form-block").forEach(function (item) {
        item.style.display = "none";
      });
      block.style.display = willOpen ? "flex" : "none";
    });
  });

  if (window.jQuery && jQuery.fn.datepicker) {
    jQuery(root)
      .find('[data-toggle="datepicker"]')
      .datepicker({
        format: "dd-mm-yyyy",
        language: "cs-CZ",
      });
  }
};

document.querySelectorAll("form.form").forEach(bindForm);
