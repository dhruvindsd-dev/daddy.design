import { cn } from "@/lib/utils";
import classes from "./styles.module.css";
interface Props {
  className?: string;
}

const Loader = ({ className }: Props) => {
  return (
    <div className={cn(classes.loader, className)}>
      <div className={classes.bar1}></div>
      <div className={classes.bar2}></div>
      <div className={classes.bar3}></div>
      <div className={classes.bar4}></div>
      <div className={classes.bar5}></div>
      <div className={classes.bar6}></div>
      <div className={classes.bar7}></div>
      <div className={classes.bar8}></div>
      <div className={classes.bar9}></div>
      <div className={classes.bar10}></div>
      <div className={classes.bar11}></div>
      <div className={classes.bar12}></div>
    </div>
  );
};
export default Loader;
