import { CardInterface } from "src/types/Card";

const Card = ({className, titleClassName, bodyClassName, title, children}: CardInterface): JSX.Element => {
  return(
    <div className={`card ${className}`}>
      <div className={`card-body ${bodyClassName}`}>
        { title && <h2 className={`card-title ${titleClassName}`}>{title}</h2>}
        {children}
      </div>
    </div>
  )
};

export default Card;