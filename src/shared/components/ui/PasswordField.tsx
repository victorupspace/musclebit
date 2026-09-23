import { useState } from 'react';

import { IconButton } from './IconButton';
import { TextField, type TextFieldProps } from './TextField';

export type PasswordFieldProps = Omit<
  TextFieldProps,
  'secureTextEntry' | 'accessory' | 'autoCapitalize' | 'autoCorrect'
>;

/** Campo de senha com botão para mostrar ou ocultar o texto. */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      accessory={
        <IconButton
          icon={visible ? 'visibility_off' : 'visibility'}
          iconSize="md"
          variant="ghost"
          color="primary"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onPress={() => setVisible((v) => !v)}
        />
      }
    />
  );
}
