'use client'
import { BeautifulMentionComponentProps } from "lexical-beautiful-mentions";
import { forwardRef } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const CustomMentionComponent = forwardRef<
  HTMLSpanElement,
  BeautifulMentionComponentProps<{ id: string }>
>(({ trigger, value, data, children, ...other }, ref) => {

  if (trigger == '@') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <span className="flex gap-[2px] items-center py-[2px] px-[8px] rounded-sm bg-border "   ref={ref} >
            <div className="w-4 h-4 bg-border rounded-full" /> {value}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Trigger: <code>{trigger}</code>
          </p>
          <p>
            Value: <code>{value}</code>
          </p>
          {data?.id && (
            <p>
              ID: <code>{data.id}</code>
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <span {...other} ref={ref} >
          {value}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Trigger: <code>{trigger}</code>
        </p>
        <p>
          Value: <code>{value}</code>
        </p>
        {data?.id && (
          <p>
            ID: <code>{data.id}</code>
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
});
CustomMentionComponent.displayName = "CustomMentionComponent";

export default CustomMentionComponent;