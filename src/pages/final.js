const AppFinal = () => {
  return (
    <>
      <h1 
        className="pt-4 mb-6 text-center text-xl sm:text-2xl md:text-4xl lg:text-6xl text-red-600">
        МОЛОДЕЦ ! ЭТО КОНЕЦ ИГРЫ
      </h1>
      <iframe 
        style={{margin: "0 auto 30px auto"}} 
        width="340" 
        height="315" 
        src="https://www.youtube.com/embed/5gLLboynQ6E" 
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    </>
  );
}

export default AppFinal