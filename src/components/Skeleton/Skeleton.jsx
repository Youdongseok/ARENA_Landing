// src/components/Skeleton/Skeleton.jsx
const Skeleton = ({ className }) => {
  return (
    <div
      className={`
        bg-gray-200 
        rounded-md 
        shimmer-effect 
        ${className} // <--- 외부에서 받은 클래스가 여기에 추가됨
      `}
    />
  );
};
export default Skeleton;
