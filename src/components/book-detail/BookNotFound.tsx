import { Link } from "react-router-dom";

export function BookNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="mb-6 text-lg text-slate-600">We could not find that story.</p>
      <Link
        to="/"
        className="rounded-2xl bg-yellow-400 px-6 py-3 font-bold text-slate-900 shadow-md hover:bg-yellow-500"
      >
        Back to stories
      </Link>
    </div>
  );
}
