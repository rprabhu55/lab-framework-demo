export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex items-center justify-center h-[calc(95vh-106px)] overflow-auto">
    <div className="h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-primary motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-500" role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
    </div>
      <span className="ml-6 text-2xl font-bold text-gray-500">Loading...</span>
   </div>
  );
}
