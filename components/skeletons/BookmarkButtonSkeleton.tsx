import Image from "next/image";

export default function BookmarkButtonSkeleton() {
  return (
    <button>
      <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-blue-900 md:flex">
        <Image
          src="/icons/icon-bookmark-active.svg"
          alt="Bookmarked"
          width={24}
          height={24}
        />
      </div>
      <div className="flex items-center justify-center md:hidden">
        <Image
          src="/icons/icon-bookmark-black-active.svg" //زchange this
          alt="Bookmarked"
          width={24}
          height={24}
        />
      </div>
    </button>
  );
}
