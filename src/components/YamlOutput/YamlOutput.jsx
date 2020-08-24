import React from 'react';
import styles from './YamlOutput.css';
import { Document } from 'yaml';
import Highlight, { defaultProps } from 'prism-react-renderer';
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import theme from 'prism-react-renderer/themes/nightOwl';

export const YamlOutput = ({ json }) => {
  const jsonDoc = new Document();
  jsonDoc.contents = json;
  return (
    <Card>
      <CardContent>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <b>Docker compose YAML</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Highlight
              {...defaultProps}
              theme={theme}
              code={jsonDoc.toString()}
              language="yaml"
              className={styles.code}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
