function Pageerror() {
  return (
    <div className="h-screen -mt-12 -mb-16 lg:-mt-8 lg:-mb-20 flex flex-col justify-center items-center text-primary opacity-60">
      <h1 className="font-bold text-[10em] sm:text-[13em] leading-tighter">
        404
      </h1>
      <h3 className="font-semibold text-4xl sm:text-6xl pb-10">
        Page Not Found
      </h3>
      <p className="text-2xl sm:text-4xl leading-snug text-center">
        Check if there is typo in your spelling
      </p>
    </div>
  );
}

export default Pageerror;
