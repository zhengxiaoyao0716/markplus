# markplus-example-table

===
## Simple Usage:
\ #ID #Group #Name
- |0 |Manager |Zheng
- |1 |User |Alice
- |2 |Guide |Bob

## Compatible Markdown:
\
|ID|Group|Name
|:-|:-:|-:
|0 |Manager |Zheng
|1 |User |Alice
|2 |Guide |Bob
\

## Complete Feature:
\ Complete feature example
#+ID(parseInt)      #:Group  #:Name #:Nickname #-Billing(parseFloat) #
#0                  |Manager |\2 Zheng         |0                    #3\ \#$ID \| \$$Billing
#99\ ${1 + ID[L-1]} |2\ User |Alice |Ali       |3.00
- Those words have no effect |\2 Bob           |3.50
                    |\3                        #${Billing.slice(0, -1).reduce((s, i) => s + i)}
\
$_ window.exportCompleteFeatureExample = () => Markplus.exportJson(this.completeFeatureExample, 'completeFeatureExample')
[EXPORT]($exportCompleteFeatureExample)
