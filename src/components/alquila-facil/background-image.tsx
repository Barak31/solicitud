
export function BackgroundImage() {
  return (
    <div 
      className="fixed inset-0 z-[-1] w-full h-full bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
       <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
}
