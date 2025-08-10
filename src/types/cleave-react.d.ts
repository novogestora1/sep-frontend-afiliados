declare module 'cleave.js/react' {
  import * as React from 'react';

  interface CleaveOptions {
    numeral?: boolean;
    numeralDecimalMark?: string;
    delimiter?: string;
    phone?: boolean;
    phoneRegionCode?: string;
    prefix?: string;
    blocks?: number[];
    delimiters?: string[];
    numericOnly?: boolean;
    creditCard?: boolean;
    onCreditCardTypeChanged?(type: string): void;
  }

  interface CleaveProps extends React.InputHTMLAttributes<HTMLInputElement> {
    options?: CleaveOptions;
    onInit?: (cleave: any) => void;
  }

  const Cleave: React.FC<CleaveProps>;
  export default Cleave;
}
