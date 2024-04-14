document.addEventListener("DOMContentLoaded", function () {
  // Sample data
  console.log("The message");
  const data = {
    title: "Welcome to Handlebars!",
    message: "This is a dynamic message rendered using Handlebars.",
  };

  // Get the Handlebars template from the script tag
  const source = document.getElementById("dynamic-content-template").innerHTML;

  // Compile the Handlebars template
  const template = Handlebars.compile(source);

  // Render the template with the data
  const html = template(data);

  // Append the rendered HTML to the DOM
  document.getElementById("dynamic-content").innerHTML = html;
});
