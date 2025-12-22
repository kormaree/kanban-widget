import { useState } from 'react';
import addIcon from './Icon/add-square-03.svg';
import switchIcon from './Icon/arrow-switch-horizontal.svg';
import calendarIcon from './Icon/calendar-02.svg';
import chartIcon from './Icon/line-chart-up-02.svg';
import pencilIcon from './Icon/pencil-03.svg';

export const Header = () => {
  const [activeIconIndex, setActiveIconIndex] = useState<number | null>(null);
  
  const basePositions = [55, 107, 159, 211, 263];
  
  const icons = [
    { src: addIcon, label: 'задачи', tooltipWidth: 64 },
    { src: switchIcon, label: 'сортировка', tooltipWidth: 106 },
    { src: calendarIcon, label: 'календарь', tooltipWidth: 97 },
    { src: chartIcon, label: 'статистика', tooltipWidth: 102 },
    { src: pencilIcon, label: 'редактирование', tooltipWidth: 151 },
  ];

  const calculatePositions = () => {
    const positions = [];
    
    if (activeIconIndex === null) {
      for (let i = 0; i < icons.length; i++) {
        positions.push({
          iconLeft: basePositions[i],
          tooltipLeft: basePositions[i] + 40,
          tooltipVisible: false
        });
      }
    } else {
      const tooltipWidth = icons[activeIconIndex].tooltipWidth;
      
      for (let i = 0; i < icons.length; i++) {
        if (i < activeIconIndex) {
          positions.push({
            iconLeft: basePositions[i],
            tooltipLeft: basePositions[i] + 40,
            tooltipVisible: false
          });
        } else if (i === activeIconIndex) {
          positions.push({
            iconLeft: basePositions[i],
            tooltipLeft: basePositions[i] + 40,
            tooltipVisible: true
          });
        } else {
          const shift = tooltipWidth + 10;
          positions.push({
            iconLeft: basePositions[i] + shift,
            tooltipLeft: basePositions[i] + shift + 40,
            tooltipVisible: false
          });
        }
      }
    }
    
    return positions;
  };

  const positions = calculatePositions();

  return (
    <div style={{
      width: "1620px",
      height: "173px",
      background: "#FFFFFF",
      borderRadius: "20px 20px 0 0",
      margin: "0 auto",
      position: "relative"
    }}>
      {/* Текст проекта */}
      <div style={{
        position: "absolute",
        width: "448px",
        height: "36px",
        top: "40px",
        left: "40px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "30px",
        lineHeight: "100%",
        color: "#000000"
      }}>
        Проект "Пример проекта 1.0"
      </div>
      
      {/* Иконки */}
      {icons.map((icon, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${positions[index].iconLeft}px`,
            top: "114px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: 'left 0.3s ease'
          }}
          onMouseEnter={() => setActiveIconIndex(index)}
          onMouseLeave={() => setActiveIconIndex(null)}
        >
          <img 
            src={icon.src}
            alt={icon.label}
            style={{ 
              width: "100%", 
              height: "100%",
              transform: activeIconIndex === index ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>
      ))}
      
      {/* Подсказки */}
      {icons.map((icon, index) => {
        if (!positions[index].tooltipVisible) return null;
        
        return (
          <div
            key={`tooltip-${index}`}
            style={{
              position: "absolute",
              width: `${icon.tooltipWidth}px`,
              height: "22px",
              top: "124px",
              left: `${positions[index].tooltipLeft}px`,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#BCC1C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            }}
          >
            {icon.label}
          </div>
        );
      })}
    </div>
  );
};