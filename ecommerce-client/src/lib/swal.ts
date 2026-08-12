import Swal from "sweetalert2";

export const swal = Swal.mixin({
  confirmButtonColor: "#16815d",
  background: "#ffffff",
  color: "#1c2734",
  customClass: {
    popup: "rounded-2xl",
    confirmButton: "rounded-full px-5 py-2 text-xs font-semibold",
  },
});

export function addedToCart(name: string) {
  return swal.fire({
    icon: "success",
    title: "Added to cart",
    text: `${name} is now in your cart.`,
    confirmButtonText: "Done",
    timer: 2500,
    timerProgressBar: true,
  });
}

export function savedForLater(name: string, saved: boolean) {
  return swal.fire({
    icon: saved ? "success" : "info",
    title: saved ? "Saved for later" : "Removed from saved",
    text: saved ? `${name} is in your saved items.` : `${name} was removed from your saved items.`,
    confirmButtonText: "OK",
    timer: 2500,
    timerProgressBar: true,
  });
}

export function productNotFound(query: string) {
  return swal.fire({
    icon: "info",
    title: "Product not available",
    text: `Sorry, we couldn't find "${query}". Please try again later or explore other products.`,
    confirmButtonText: "OK",
  });
}

export function duplicateItemConfirm(name: string) {
  return swal.fire({
    icon: "warning",
    title: "Already in cart",
    text: `"${name}" is already in your cart. Do you want to add it again?`,
    showCancelButton: true,
    confirmButtonText: "Yes, add it",
    cancelButtonText: "No, cancel",
  });
}
