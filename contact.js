/* =========================================================
   যোগাযোগ ফর্ম হ্যান্ডলার
   এই সাইটটি স্ট্যাটিক (কোনো নিজস্ব সার্ভার নেই), তাই মেইল পাঠাতে
   Formspree (https://formspree.io) ব্যবহার করা হচ্ছে — বিনামূল্যে,
   কোনো ব্যাকএন্ড কোড ছাড়াই কাজ করে।

   সেটআপ:
   1. https://formspree.io -তে গিয়ে ফ্রি অ্যাকাউন্ট খুলুন।
   2. নতুন ফর্ম তৈরি করুন এবং রিসিভার ইমেইল হিসেবে
      biplabpaladhiit@gmail.com বসান।
   3. Formspree আপনাকে একটি ফর্ম এন্ডপয়েন্ট URL দেবে, যেমন:
      https://formspree.io/f/abcdwxyz
   4. নিচের FORM_ENDPOINT ভ্যারিয়েবলে সেই URL বসান।
   ========================================================= */

const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID"; // <-- এখানে আপনার Formspree URL বসান

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const successBox = document.getElementById("form-success");
  const errorBox = document.getElementById("form-error");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "পাঠানো হচ্ছে...";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        form.hidden = true;
        successBox.hidden = false;
      } else {
        errorBox.hidden = false;
      }
    } catch (err) {
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "পাঠান";
    }
  });
}

document.addEventListener("DOMContentLoaded", setupContactForm);
