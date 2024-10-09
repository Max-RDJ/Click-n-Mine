def StringChallenge(strParam):
  string_no_spaces = strParam.replace(" ", "")
  num_vowels = 0
  for i in string_no_spaces:
    if i in 'aeiou':
      num_vowels += 1
  num_consonants = len(string_no_spaces) - num_vowels
  return num_consonants

# keep this function call here 
print StringChallenge(raw_input())