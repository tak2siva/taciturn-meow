class TreeMap < Hash
 def []= key, val
   super key, val
   my_sort
 end

 def my_sort
   tmp = {}
   keys.map(&:to_sym).sort.map do |key|
	tmp[key.to_sym] = self[key] || self[key.to_s]
   end
   replace tmp.to_h
 end
end
