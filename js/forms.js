document.querySelectorAll("form.terminform, form.form").forEach(function (form) {
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
});
