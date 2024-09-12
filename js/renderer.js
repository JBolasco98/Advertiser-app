const form = document.getElementById("form_sentence");
const infoText = document.getElementById("info-text");
const sentenceCorrected = document.getElementById("sentence_corrected");
const responseContainer = document.getElementById("response-container");
var textarea = document.getElementById("sentence_corrected");


if (form) {
  textarea.classList.add("hidden"); // To hide the textarea
  textarea.classList.remove("hidden"); // To show the textarea
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    let sentence = formData.get("sentence");

    if (sentence.length <= 2) {
      alertMessages("error", "Please put a product name.");
      return;
    }

    try {
      infoText.textContent =  '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
      infoText.textContent = `Generating Advertisement for ${sentence}`;
      infoText.style.display = "block";

      const response = await window.axios.openAI(formData.get("sentence"));
      responseContainer.style.display = "block";
      infoText.style.display = "none";
      sentenceCorrected.innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');

      const db_response = await window.axios.supaBase('post', 'prompts', {
        sentence: sentence,
        sentence_corrected: response.choices[0].text
      });
    } catch (error) {
      console.error(error);
    }
  });
}

function alertMessages(status, sentence) {
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    gravity: "top",
    position: "top-left",
    stopOnFocus: true,
    style: {
      textAlign: "center",
      background: status == "error" ? "red" : "green",
      color: "white",
      padding: "5px",
      marginTop: "-500px",
    },
  });
}
