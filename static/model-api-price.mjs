try {
  const response = await fetch("https://api.corbanu.com/v1/company-model-plan");
  if (response.ok) {
    const plan = await response.json();
    if (/^[0-9]+(?:\.[0-9]+)?$/.test(plan.monthlyUsd)) document.querySelector("[data-model-price]").textContent = `$${plan.monthlyUsd} per month`;
  }
} catch { /* Dated launch price remains visible if the live quote is unavailable. */ }
