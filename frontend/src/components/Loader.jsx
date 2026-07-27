const Loader = ({ small }) => (
  <div className={`flex items-center justify-center ${small ? 'py-4' : 'py-20'}`}>
    <div className={`${small ? 'w-5 h-5' : 'w-8 h-8'} border-2 border-border border-t-primary rounded-full animate-spin`} />
  </div>
);

export default Loader;