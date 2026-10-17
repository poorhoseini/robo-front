import ResponsiveLink from "@/components/general/ResponsiveLink";

export default function NotFound() {
  return (
    <div className="ltr flex h-screen w-full flex-col items-center justify-center gap-2">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p className="text-red-500">404 Error here</p>
      <ResponsiveLink href="/">Return Home</ResponsiveLink>
    </div>
  );
}
