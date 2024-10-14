export const LongScrollLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className={`
      flex justify-between items-center
      h-full min-h-screen w-screen
    `}>
      {children}
    </div>
  );
};