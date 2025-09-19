import Image from "next/image";

export default function LoginRightSide() {
  return (
    <div className="w-full md:w-1/2 bg-gray-800 text-white p-10 flex flex-col justify-between">
      <h1 className="text-2xl font-semibold">Polosys</h1>
      <div className="mb-6 flex items-center justify-center min-h-fit">
        {/* Vector Shape */}
        <Image
          src="/images/vector-image-no-bg.png"
          alt="Polosys"
          width={300}
          height={200}
          priority
        />
      </div>
      <p className="mt-6 text-4xl leading-relaxed pb-8">
        Join now and manage <br />
        your customers from <br />
        anywhere
      </p>
    </div>
  );
}
