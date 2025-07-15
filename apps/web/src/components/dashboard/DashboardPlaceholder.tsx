const DashboardPlaceholder = () => {
  return (
    <div className="animate-pulse">
      {/* Buttons placeholder */}
      <div className="mb-4 flex flex-col-reverse gap-4 md:flex-row">
        <div className="h-10 w-64 rounded-md bg-gray-200"></div>
        <div className="h-10 w-64 rounded-md bg-gray-200"></div>
      </div>

      {/* Chart and Currently section */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-12">
        <div className="h-96 w-full rounded bg-gray-200 md:w-[475px] lg:w-[650px] xl:w-[840px]"></div>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 rounded bg-gray-200"></div>
          <div className="h-12 w-48 rounded bg-gray-200"></div>
          <div className="h-8 w-40 rounded bg-gray-200"></div>
          <div className="h-4 w-36 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Recent Readings and Stats section */}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-12 lg:gap-20">
        <div className="w-full md:w-auto">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200"></div>
          {/* Table skeleton matching md:min-w-[280px] */}
          <div className="w-full space-y-2 md:w-[280px]">
            {/* Table header */}
            <div className="flex gap-4 pb-2">
              <div className="h-5 w-16 rounded bg-gray-200"></div>
              <div className="ml-auto h-5 w-16 rounded bg-gray-200"></div>
              <div className="h-5 w-16 rounded bg-gray-200"></div>
            </div>
            {/* Table rows */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-5 w-20 rounded bg-gray-200"></div>
                <div className="ml-auto h-5 w-16 rounded bg-gray-200"></div>
                <div className="h-5 w-16 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* Deltas section */}
          <div>
            <div className="mb-3 h-6 w-48 rounded bg-gray-200"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-64 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
          {/* Stats section */}
          <div>
            <div className="mb-3 h-6 w-52 rounded bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-5 w-80 rounded bg-gray-200"></div>
              <div className="mt-4 h-5 w-72 rounded bg-gray-200"></div>
              <div className="h-5 w-64 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;
