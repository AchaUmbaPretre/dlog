import { Skeleton } from 'antd';

const InspectionSkeleton = () => (
  <>
    <div className="inspectionGen_top">
      <Skeleton active paragraph={false} title={{ width: '60%' }} />
      <Skeleton active paragraph={false} title={{ width: '50%' }} />
      <Skeleton active paragraph={false} title={{ width: '40%' }} />
    </div>

    <div className="inspectionGen_bottom_wrapper">
      {[1, 2, 3].map(i => (
        <div className="inspectionGen_bottom" key={i}>
          <div className="inspectionGen_bottom_rows">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </div>
      ))}
    </div>
  </>
);

export default InspectionSkeleton;
