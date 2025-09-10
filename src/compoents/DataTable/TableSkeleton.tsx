// src/components/DataTable/TableSkeleton.tsx
import React from 'react'

export const TableSkeleton: React.FC = () => {
  const skeletonRows = Array.from({ length: 5 }, (_, index) => index)
  
  return (
    <div className="table-skeleton">
      {skeletonRows.map((index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
          }}
        >
          {/* 选择框骨架 */}
          <div style={{ marginRight: '12px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </div>
          
          {/* 数据列骨架 */}
          {Array.from({ length: 4 }, (_, colIndex) => (
            <div
              key={colIndex}
              style={{
                flex: '1',
                padding: '0 8px'
              }}
            >
              <div
                style={{
                  height: '16px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  width: `${60 + Math.random() * 40}%`,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  animationDelay: `${colIndex * 0.1}s`
                }}
              />
            </div>
          ))}
        </div>
      ))}
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}